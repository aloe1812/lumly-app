import { Injectable } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { ElectronService } from 'app/core/electron.service';
import { Subject } from 'rxjs/Subject';

import * as forEach from 'lodash/forEach';
import * as findIndex from 'lodash/findIndex';
import * as isEmpty from 'lodash/isEmpty';
import * as has from 'lodash/has';
import * as isArray from 'lodash/isArray';
import * as isString from 'lodash/isString';

@Injectable()
export class ProjectService {

  public projects = [];
  public activeProject;

  private projectOpenedSub = new Subject();
  public projectOpened = this.projectOpenedSub.asObservable();

  private lastChangesStatus = false;

  constructor(
    private store: StoreService,
    private electronService: ElectronService
  ) {
    this.subscribeToElectronEvents();
  }

  parseProjectFile(file) {
    const project = JSON.parse(file);

    if (!this.isProjectValid(project)) {
      throw Error;
    }

    return project;
  }

  isProjectValid(project) {
    if ( !(has(project, 'project') && has(project, 'content') && has(project, 'project.title') && has(project, 'content.files')) ) {
      return false;
    }

    if (!isString(project.project.title)) {
      return false;
    }

    if (!isArray(project.content.files)) {
      return false;
    }

    return true;
  }

  storeProject(project) {
    if ( !has(project, 'project.path') ) {
      this.projects.push(project);
      return;
    }

    const storedIndex = findIndex(this.projects, storedProject => storedProject.project.path === project.project.path);

    if (storedIndex === -1) {
      this.projects.push(project);
    } else {
      this.projects[storedIndex] = project;
    }
  }

  setActive(project) {
    this.activeProject = project;
    this.checkProjectChangesStatus(true);

    this.store.data('Project:Active').set(project);
  }

  prepareProject(project, isNew = false) {
    if (isNew) {
      project.project.changes = {
        'PROJECT_SELF': {
          isNew: true
        }
      };
    } else {
      project.project.changes = {};
    }

    project.project.guidCounter = 0;

    setFilesGuid(project.content.files);

    function setFilesGuid(files) {
      forEach(files, file => {
        file.guid = ++project.project.guidCounter;
        if (file.type === 'group' && file.files && file.files.length) {
          setFilesGuid(file.files)
        }
      });
    }
  }

  saveChange(changes) {
    if ( !(changes instanceof Array) ) {
      changes = [changes];
    }

    const changesStore = this.activeProject.project.changes;

    forEach(changes, change => {
      if ( !(change.guid in changesStore) ) {
        changesStore[change.guid] = change.changes;
      } else {
        forEach(change.changes, (value, key) => {
          changesStore[change.guid][key] = value;
        });
      }

      // удаляем запись об изменении, если прокт был новым, а потом был удален
      if (changesStore[change.guid].isNew && changesStore[change.guid].isDeleted) {
        delete changesStore[change.guid];
      }

      // убираем запись об изменениях, если все изменений нет
      let hasChanges = false;

      forEach(changesStore[change.guid], (value, key) => {
        if (value === true) {
          hasChanges = true;
          return false;
        }
      });

      if (!hasChanges) {
        delete changesStore[change.guid];
      }
    });

    this.checkProjectChangesStatus();
  }

  getProjectDataForSave() {
    return {
      project: {
        title: this.activeProject.project.title
      },
      content: {
        files: cloneFiles(this.activeProject.content.files)
      }
    };

    function cloneFiles(files) {
      const filesClone = [];

      forEach(files, fileItem => {
        const file: any = {
          title: fileItem.title,
          type: fileItem.type
        }

        if (file.type === 'file') {
          file.content = fileItem.content;
        }

        if (file.type === 'group') {
          file.files = cloneFiles(fileItem.files);
        }

        filesClone.push(file);
      });

      return filesClone;
    }
  }

  updateProjectAfterSave() {
    this.activeProject.project.changes = {};

    updateFiles(this.activeProject.content.files);

    this.lastChangesStatus = false;
    this.store.data('Project:Active:HasChanges').set(false);

    function updateFiles(files) {
      forEach(files, (file) => {
        if (file.type === 'file') {
          file.isChanged = false;
          file.originalContent = file.content;
        }

        file.isNew = false;
        file.isTitleChanged = false;
        file.originalTitle = file.title;

        if (file.type === 'group') {
          updateFiles(file.files);
        }
      });
    }
  }

  openProject() {
    this.electronService.ipcRenderer.send('Open:Project');
  }

  saveProject() {
    const projectData = this.getProjectDataForSave();

    if (this.activeProject.project.path) {
      this.electronService.ipcRenderer.send('Project:Save', {
        path: this.activeProject.project.path,
        file: JSON.stringify(projectData)
      });
    } else {
      this.electronService.ipcRenderer.send('Project:SaveAs', {
        file: JSON.stringify(projectData),
        fileName: projectData.project.title
      });
    }
  }

  private checkProjectChangesStatus(forceChange = false) {
    const isProjectHasChanges = !isEmpty(this.activeProject.project.changes);

    if (forceChange || (isProjectHasChanges !== this.lastChangesStatus)) {
      this.lastChangesStatus = isProjectHasChanges;
      this.store.data('Project:Active:HasChanges').set(isProjectHasChanges);
    }
  }

  private subscribeToElectronEvents() {

    // Событие после того как проект был открыт
    this.electronService.ipcRenderer.on('Project:Opened', (event, data) => {
      try {
        const project = this.parseProjectFile(data.file)

        project.project.path = data.path;

        this.prepareProject(project);
        this.storeProject(project);
        this.setActive(project);

        this.projectOpenedSub.next();
      } catch (e) {
        alert('Provided file is incorrect or damaged');
      }
    });

    // Ошибка после попытки открытия проекта: неверное расширение файла
    this.electronService.ipcRenderer.on('Project:Opened:Error:Extenstion', () => {
      alert(`File extension is incorrect. Must be 'lumly'`);
    });

    // Событие после того как проект был сохранен
    this.electronService.ipcRenderer.on('Project:Saved', (event, path) => {
      // if path was created (i.e. locally created project was saved)
      if (path) {
        this.activeProject.project.path = path;
      }

      this.updateProjectAfterSave();
    });

    // Ошибка при сохранении файла
    this.electronService.ipcRenderer.on('Project:Saved:Error', () => {
      alert('There was an error on saving file');
    });

    // Ошибка, если файл не существует в том месте, откуда был изначально открыт
    this.electronService.ipcRenderer.on('Project:Saved:Error:Exist', (event, data) => {
      alert('Error: Cannot find path. Perhaps project file was relocated. Please, select where to save project file.');

      this.electronService.ipcRenderer.send('Project:SaveAs', {
        file: data.file,
        fileName: data.fileName || data.file.project.title
      });
    });
  }

}

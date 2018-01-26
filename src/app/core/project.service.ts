import { Injectable } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { ipcRenderer, remote } from 'electron';
import { Project, ProjectPristine } from './declarations/project.d';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';
import { FileService } from 'app/core/file.service';

import * as isEmpty from 'lodash/isEmpty';
import * as forEach from 'lodash/forEach';
import * as isArray from 'lodash/isArray';

import * as nodePath from 'path';

const recents = remote.require('./electron/store').recents;
const currentWindow = remote.getCurrentWindow();

const FILE_ERRORS = {
  ext: `Error: File extension is incorrect. Must be 'lumly'`,
  invalid: 'Error: Provided file is incorrect or damaged',
  general:  `Error: Project file cannot be found or opened`,
  'save:not-exists': 'Error: Cannot find project path. Perhaps project file was relocated. Please, select where to save project file',
  'save:general': 'There was an error on saving file'
}

@Injectable()
export class ProjectService {

  project: Project;
  recentProjects: any[];

  onProjectOpen = new BehaviorSubject(<any>{pending: true});
  onProjectSaved = new Subject();

  private editorComponent;
  private closeAfterSave: boolean | string = false;

  constructor(
    private store: StoreService,
    private title: Title,
    private fileService: FileService
  ) {
    this.recentProjects = recents.get();

    recents.onUpdate(items => {
      this.recentProjects.splice(0, this.recentProjects.length, ...items);
    }, currentWindow.id);

    this.subscribeToEvents();
    this.subscribeToTriggerEvents();
  }

  setEditorComponent(componentRef) {
    this.editorComponent = componentRef;
  }

  prepareProject(project: Project, isNew = false, path?: string) {
    if (project.isPrepared) {
      return;
    }

    if (isNew) {
      project.project.changes = {
        'PROJECT_SELF': {
          isNew: true
        }
      };
    } else {
      project.project.changes = {};
    }

    if (path) {
      project.project.path = path;
    }

    project.isPrepared = true;
    project.project.guidCounter = 0;
    project.project.originalTitle = project.project.title;

    project.project.hasChanges = !isEmpty(project.project.changes);

    setFilesGuid(project.content.files, 0);

    function setFilesGuid(files, parentGuid) {
      forEach(files, file => {
        file.guid = ++project.project.guidCounter;
        file.parentGuid = parentGuid;

        if (file.type === 'group' && file.files && file.files.length) {
          setFilesGuid(file.files, file.guid)
        }
      });
    }
  }

  saveChange(changes) {
    const changesStore = this.project.project.changes;

    const processChange = (change) => {
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
    }

    if (isArray(changes)) {
      forEach(changes, processChange);
    } else {
      processChange(changes);
    }

    this.project.project.hasChanges = !isEmpty(this.project.project.changes);
  }

  openProject() {
    ipcRenderer.send('open-project-file-dialog', {origin: 'window'});
  }

  openProjectFromPath(path: string, origin?: string) {
    ipcRenderer.send('open-project-file', {origin: origin || 'window', path});
  }

  openProjectFromData(projectData) {
    this.activateProject(projectData);
  }

  openEmpty() {
    this.onProjectOpen.next({tryOpen: false});
  }

  activateProject(project, isNew = false) {
    this.prepareProject(project, isNew);

    this.project = project;

    const eventData: any = {};

    if (project.project.path) {
      eventData.projectPath = project.project.path;
    }

    this.setWindowTitle();
    ipcRenderer.send('set-window-project-active', eventData);

    this.onProjectOpen.next({
      tryOpen: true,
      success: true
    });
  }

  saveProject(isSaveAs = false) {
    // сохраняем историю активного файла, чтобы была сохранена акутуальная история
    this.editorComponent.saveActiveFileHistory();

    if (!isSaveAs && !this.project.project.hasChanges) {
      return;
    }

    const projectData = this.getProjectDataForSave();

    if (isSaveAs || !this.project.project.path) {
      const saveData: any = {
        file: JSON.stringify(projectData),
        fileName: projectData.project.title
      };

      if (this.project.project.path) {
        saveData.path = this.project.project.path;
      }

      ipcRenderer.send('project-save-as', saveData);
    } else {
      ipcRenderer.send('project-save', {
        path: this.project.project.path,
        file: JSON.stringify(projectData)
      });
    }
  }

  setWindowTitle() {
    if (this.project) {
      if (this.project.project.path) {
        this.title.setTitle(`${this.project.project.title} (${nodePath.basename(this.project.project.path)})`);
      } else {
        this.title.setTitle(`${this.project.project.title} (unsaved)`);
      }
    } else {
      this.title.setTitle('Lumly');
    }
  }

  private getProjectDataForSave(): ProjectPristine {
    return {
      project: {
        title: this.project.project.title
      },
      content: {
        files: this.fileService.cloneFilesForSave(this.project.content.files)
      }
    };
  }

  private updateProjectAfterSave() {
    this.project.project.changes = {};

    this.fileService.updateFilesAfterSave(this.project.content.files, 0);

    this.project.project.hasChanges = false;
    this.project.project.originalTitle = this.project.project.title;
  }

  private subscribeToEvents() {
    ipcRenderer.on('project-file-opened', (event, evData) => {
      this.activateProject(evData.project);
    });

    ipcRenderer.on('open-project-file:error', (ev, evData) => {
      const errorData: any = {
        tryOpen: true,
        success: false,
        error: FILE_ERRORS[evData.type]
      }

      if (evData.origin === 'file') {
        errorData.fromFile = true
      }

      this.onProjectOpen.next(errorData);
    });

    ipcRenderer.on('project-saved', (ev, evData) => {
      if (evData && evData.path) { // был сохранен как
        this.project.project.path = evData.path;
        ipcRenderer.send('set-window-project-active', {
          projectPath: this.project.project.path
        });
        this.setWindowTitle();
      }

      this.onProjectSaved.next();
      this.updateProjectAfterSave();

      if (this.closeAfterSave) {
        if (this.closeAfterSave === 'project') {
          this.closeProject();
          this.closeAfterSave = false;
        } else {
          currentWindow.close();
        }
      }
    });

    ipcRenderer.on('project-save:error', (ev, evData) => {
      alert(FILE_ERRORS[evData.type]);

      if (evData.type === 'save:not-exists') {
        ipcRenderer.send('project-save-as', {
          file: evData.file,
          fileName: evData.fileName || evData.file.project.title
        });
      }
    });

    ipcRenderer.on('get-project', () => {
      window.onbeforeunload = null;

      if (this.editorComponent) {
        this.editorComponent.saveActiveFileHistory();
      }

      ipcRenderer.send('got-project', {
        project: this.project
      });
    });
  }

  private subscribeToTriggerEvents() {
    ipcRenderer.on('trigger-project-save', (ev, data) => {
      this.closeAfterSave = !!data && data.closeAfterSave;

      if (!this.project) {
        return;
      }

      this.saveProject();
    });

    ipcRenderer.on('trigger-project-save-as', () => {
      if (!this.project) {
        return;
      }
      this.saveProject(true);
    });

    ipcRenderer.on('trigger-project-close', (ev, data) => {
      const ignoreChanges = !!(data && data.ignoreChanges);
      this.closeProject(ignoreChanges);
    });

    ipcRenderer.on('trigger-add', (ev, type) => {
      switch (type) {
        case 'file':
          this.store.event('File:Add').emit();
          return;
        case 'folder':
          this.store.event('Folder:Add').emit();
          return;
      }
    });
  }

  private closeProject(ignoreChanges = false) {
    // есть изменения => запуская alert что не сохранили изменения
    // но также можем и проигнорировать проверку (это если в алерте выбрали пункт Don't Save)
    if (!ignoreChanges && this.project.project.hasChanges) {
      ipcRenderer.send('unsaved-alert');
    } else if (this.project) { // если есть проект => то переходим на начальный экран
      this.onProjectOpen.next(false);
      ipcRenderer.send('set-window-project-active', {clearProject: true});
      this.project = null;
      this.setWindowTitle();
      this.store.data('JSON-UML').set(null);
    } else {
      currentWindow.close();
    }
  }

}

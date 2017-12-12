import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as forEach from 'lodash/forEach';
import * as isEmpty from 'lodash/isEmpty';

@Injectable()
export class ProjectService {

  private activeProject;
  private lastChangesStatus = false;

  private changesSub = new Subject<any>();
  public onProjectHasChanges = this.changesSub.asObservable();

  constructor() { }

  prepareProject(project) {
    this.activeProject = project;

    project.project.changes = {};
    project.project.guidCounter = 0;
    setFilesGuid(project.content.files);

    this.checkProjectChangesStatus(true);

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
      }

      forEach(change.changes, (value, key) => {
        changesStore[change.guid][key] = value;
      });

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
    this.changesSub.next(false);

    function updateFiles(files) {
      forEach(files, (file) => {
        if (file.type === 'file') {
          file.isChanged = false;
          file.originalContent = file.content;
        }

        if (file.type === 'group') {
          updateFiles(file.files);
        }
      });
    }
  }

  private checkProjectChangesStatus(forceChange = false) {
    const isProjectHasChanges = !isEmpty(this.activeProject.project.changes);

    if (forceChange || (isProjectHasChanges !== this.lastChangesStatus)) {
      this.lastChangesStatus = isProjectHasChanges;
      this.changesSub.next(isProjectHasChanges);
    }
  }

}

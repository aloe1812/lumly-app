import { Injectable } from '@angular/core';
import { FilePristine, File } from './declarations/project.d';
import { ipcRenderer } from 'electron';
import * as forEach from 'lodash/forEach';

@Injectable()
export class FileService {

  private activeContextFileRef;

  constructor() {
    this.subscribeToElectronEvents();
  }

  getDeletedGuidsAndSelection(file) {
    const deletedGuids = [];
    let selectedFile = null;

    deletedGuids.push(file.guid);

    if (file.isSelected) {
      selectedFile = file;
    }

    if (file.type === 'group') {
      getInnerDeleted(file.files);
    }

    return {
      deletedGuids,
      selectedFile
    };

    function getInnerDeleted(files) {
      for (let i = 0; i < files.length; i++) {
        // сохраняем данные о файле который был выбран, но потом удален
        if (files[i].isSelected) {
          selectedFile = files[i];
        }

        if (files[i].type === 'group') {
          getInnerDeleted(files[i].files);
        }

        deletedGuids.push(files[i].guid);
      }
    }
  }

  sortFiles(files) {
    files.sort((a, b) => {
      if (a.type === b.type) {
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }

        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }

        return 0;
      }

      if (a.type === 'group' && b.type === 'file') {
        return -1;
      }

      if (a.type === 'file' && b.type === 'group') {
        return 1;
      }

      return 0;
    });
  }

  openFileContextMenu(fileRef, params) {
    this.activeContextFileRef = fileRef;
    ipcRenderer.send('file-open-context-menu', params);
  }

  updateFilesAfterSave(files: File[], parentGuid: number) {
    forEach(files, (file) => {
      if (file.type === 'file') {
        file.isChanged = false;
        file.originalContent = file.content;
      }

      file.parentGuid = parentGuid;
      file.isNew = false;
      file.isTitleChanged = false;
      file.originalTitle = file.title;

      if (file.type === 'group') {
        this.updateFilesAfterSave(file.files, file.guid);
      }
    });
  }

  cloneFilesForSave(files: File[]): FilePristine[] {
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
        file.files = this.cloneFilesForSave(fileItem.files);
      }

      if (fileItem.history) {
        file.history = fileItem.history;
      }

      filesClone.push(file);
    });

    return filesClone;
  }

  private subscribeToElectronEvents() {
    ipcRenderer.on('file-context-menu-selected', (event, type) => {
      this.activeContextFileRef.handleMenuEvent(type);
    });
  }

}

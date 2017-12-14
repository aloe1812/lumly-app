import { Injectable } from '@angular/core';

@Injectable()
export class FileService {

  constructor() { }

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

}

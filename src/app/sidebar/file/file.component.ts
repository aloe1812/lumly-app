import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { DragService } from 'app/core/drag.service';
import { StoreService } from '../../core/store.service';
import { FileService } from '../../core/file.service';
import { ProjectService } from '../../core/project.service';
import { SharedUiUtilsService } from '../../shared/shared-ui-utils.service';

import * as forEach from 'lodash/forEach';
import * as remove from 'lodash/remove';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FileComponent implements OnInit {

  @Input() file;
  @Input() path;
  @Input() level = 1;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() positionChanged: EventEmitter<any> = new EventEmitter();

  files;
  filePath = [];
  fileStyle;
  isHovered = false;
  isRename = false;

  public get isFile() {
    return this.file.type === 'file';
  }
  public get isGroup() {
    return this.file.type === 'group';
  }

  constructor(
    public elementRef: ElementRef,
    private store: StoreService,
    private uiUtils: SharedUiUtilsService,
    private fileService: FileService,
    private projectService: ProjectService,
    private dragService: DragService
  ) { }

  ngOnInit() {
    this.setStyle();
    this.setPath();

    this.dragService.addFile(this);

    if (this.isGroup) {
      this.getInnerFiles();
      this.sortFiles();
    }

    if (this.file._immediateSelect || this.file.isSelected) {
      delete this.file._immediateSelect;
      this.select(true);
    }

    if (this.file._checkPosition) {
      delete this.file._checkPosition;

      this.checkIfPositionChanged();

      if (this.isFile) {
        this.store.data('File:Show:Path').set(this.filePath);
      }

      this.positionChanged.emit();
    }
  }

  sortFiles() {
    this.fileService.sortFiles(this.files);
  }

  onClick() {
    if (this.isRename) {
      return;
    }

    if (this.isGroup) {
      this.toggle();
    } else if (this.isFile) {
      this.select();
    }
  }

  openContext(event) {
    event.preventDefault();

    this.fileService.openFileContextMenu(this, {
      x: event.x,
      y: event.y
    });
  }

  onRenamed() {
    this.isRename = false;
    this.positionChanged.emit();
  }

  onInnerDelete(data) {
    if (!data.wasDeleted) {
      remove(this.files, data.file);
      data.wasDeleted = true;
    }

    this.onDelete.emit(data);
  }

  handleMenuEvent(type) {
    if (!type) {
      return;
    }

    if (type === 'rename') {
      this.isRename = true;
    }

    if (type === 'delete') {
      this.confirmDelete();
    }
  }

  private getInnerFiles() {
    if (!this.file.files) {
      this.file.files = [];
    }
    this.files = this.file.files;
  }

  private toggle() {
    this.file.isToggled = !this.file.isToggled;
  }

  private select(force = false) {
    if (!force && this.file.isSelected) {
      return;
    }

    this.store.event('File:Selected').emit(this.file);
    this.store.data('File:Show:Path').set(this.filePath);
  }

  private setPath() {
    if (this.path !== undefined) {
      this.filePath = this.path.concat(this.file);
    } else {
      this.filePath = [this.file];
    }
  }

  private confirmDelete() {
    let title;
    if (this.isGroup) {
      title = 'group';
    } else if (this.isFile) {
      title = 'file';
    }
    this.uiUtils.confirmDelete({title})
      .subscribe((isSure) => {
        if (isSure) {
          this.deleteFile();
        }
      });
  }

  private deleteFile() {
    const { deletedGuids, selectedFile } = this.fileService.getDeletedGuidsAndSelection(this.file);

    const changes = [];

    forEach(deletedGuids, guid => {
      changes.push({
        guid,
        changes: {
          isDeleted: true
        }
      });
    });

    this.projectService.saveChange(changes);

    this.onDelete.emit({
      file: this.file,
      deletedGuids,
      selectedFile
    });
  }

  private setStyle() {
    this.fileStyle = {
      'padding-left': -9 + 18 * this.level + 'px'
   }
  }

  // TODO: разобраться почему вылетает ошибка ExpressionChangedAfterItHasBeenCheckedError
  private checkIfPositionChanged() {
    let currentParentGuid;

    if (this.path) {
      currentParentGuid = this.path[this.path.length - 1].guid;
    } else {
      currentParentGuid = 0;
    }

    setTimeout(() => {
      this.projectService.saveChange({
        guid: this.file.guid,
        changes: {
          isMoved: currentParentGuid !== this.file.parentGuid
        }
      });
    });
  }

}

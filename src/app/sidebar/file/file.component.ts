import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { SharedUiUtilsService } from '../../shared/shared-ui-utils.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FileComponent implements OnInit {

  @Input() file;
  @Input() path;

  files;
  filePath = [];
  isHovered = false;
  isRename = false;

  public get isFile() {
    return this.file.type === 'file';
  }
  public get isGroup() {
    return this.file.type === 'group';
  }

  constructor(
    private store: StoreService,
    private uiUtils: SharedUiUtilsService
  ) { }

  ngOnInit() {
    this.setPath();

    if (this.isGroup) {
      this.getInnerFiles();
    }

    if (this.file._immediateSelect) {
      delete this.file._immediateSelect;
      this.select();
    }
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
    this.openMenu(event);
  }

  onRenamed() {
    this.isRename = false;
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

  private select() {
    if (this.file.isSelected) {
      return;
    }

    this.store.event('File:Selected').emit({
      file: this.file,
      path: this.filePath
    });
  }

  private setPath() {
    if (this.path !== undefined) {
      this.filePath = this.path.concat(this.file);
    } else {
      this.filePath = [this.file];
    }
  }

  private openMenu(ev) {
    this.isHovered = true;

    const menuItems = [
      {
        title: 'Rename',
        type: 'rename'
      },
      {
        title: 'Delete',
        type: 'delete',
        class: 'delete'
      }
    ];

    this.uiUtils.openMenu({
      items: menuItems,
      event: ev
    }).subscribe(evType => {
      this.isHovered = false;

      if (!evType) {
        return;
      }

      if (evType === 'rename') {
        this.isRename = true;
      }

      if (evType === 'delete') {
        this.confirmDelete();
      }
    });
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
          console.log('delete!');
        }
      });
  }

}

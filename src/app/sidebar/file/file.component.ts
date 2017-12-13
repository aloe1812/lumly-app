import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StoreService } from '../..//core/store.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileComponent implements OnInit {

  @Input() file;
  @Input() path;

  files;

  public get isFile() {
    return this.file.type === 'file';
  }
  public get isGroup() {
    return this.file.type === 'group';
  }

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.setPath();

    if (this.isGroup) {
      this.getInnerFiles();
    }
  }

  onClick() {
    if (this.isGroup) {
      this.toggle();
    } else if (this.isFile) {
      this.select();
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

  private select() {
    if (this.file.isSelected) {
      return;
    }

    this.store.event('File:Selected').emit({
      file: this.file,
      path: this.path
    });
  }

  private setPath() {
    if (this.path !== undefined) {
      this.path = this.path + '.' + this.file.title;
    } else {
      this.path = this.file.title;
    }
  }

}

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileComponent implements OnInit {

  @Input() file;

  files

  public get isFile() {
    return this.file.type === 'file';
  }
  public get isGroup() {
    return this.file.type === 'group';
  }

  constructor() { }

  ngOnInit() {
    if (this.isGroup) {
      this.getInnerFiles();
    }
  }

  private getInnerFiles() {
    if (!this.file.files) {
      this.file.files = [];
    }
    this.files = this.file.files;
  }

}

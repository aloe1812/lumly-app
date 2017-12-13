import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-file-rename',
  template: '<input type="text" (focusout)="onFocusOut()" (keydown)="onKeydown($event)">',
  encapsulation: ViewEncapsulation.None
})
export class FileRenameComponent implements OnInit {

  @Input() file;
  @Output() renamed: EventEmitter<any> = new EventEmitter();

  input;
  closed = false;

  constructor(
    private elementRef: ElementRef,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.input = this.elementRef.nativeElement.querySelector('input');
    this.input.value = this.file.title;
    this.input.select();
  }

  onFocusOut() {
    if (this.closed) {
      this.renamed.emit();
    } else {
      this.saveFileNameAndExit();
    }
  }

  onKeydown(ev) {
    if (ev.keyCode === 13) { // Enter
      this.closed = true;
      this.saveFileNameAndExit();
    } else if (ev.keyCode === 27) { // ESC
      this.closed = true;
      this.renamed.emit();
    }
  }

  saveFileNameAndExit() {
    const fileName = this.input.value;

    if (!this.file.originalTitle) {
      this.file.originalTitle = this.file.title;
    }

    this.file.isTitleChanged = this.file.originalTitle !== fileName;

    this.file.title = fileName;

    this.projectService.saveChange({
      guid: this.file.guid,
      changes: {
        isTitleChanged: this.file.isTitleChanged
      }
    });

    this.renamed.emit();
  }

}

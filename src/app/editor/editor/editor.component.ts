import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';
import { ElectronService } from '../../core/electron.service';

import * as CodeMirror from 'CodeMirror';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import * as has from 'lodash/has';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('textarea') textarea: ElementRef;

  editor;
  activeFile;
  lastFileChangedStatus = false;

  private codeTerms = new Subject<string>();

  constructor(
    private store: StoreService,
    private projectService: ProjectService,
    private electronService: ElectronService
  ) { }

  ngOnInit() {
    this.initEditor();
    this.subscribeToActiveFile();
    this.subscribeToCodeChange();
    this.subscribeToProjectSaved();
  }

  private initEditor() {
    this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers'],
      tabSize: 2
    });

    this.editor.on('change', (codemirror) => {
      this.codeTerms.next(codemirror.getValue());
    });
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get()
      .subscribe(({file}) => {
        if ( !has(file, 'originalContent') ) {
          file.originalContent = file.content;
        }

        this.lastFileChangedStatus = !!file.isChanged;

        this.activeFile = file;
        this.editor.setValue(file.content);
      });
  }

  private subscribeToCodeChange() {
    this.codeTerms.debounceTime(450).subscribe((code) => {
      this.setNewFileContent(code);
    });
  }

  private setNewFileContent(code) {
    if (!this.activeFile) {
      return;
    }

    this.activeFile.content = code;

    if (this.activeFile.type === 'playground') {
      return;
    }

    this.activeFile.isChanged = this.activeFile.originalContent !== this.activeFile.content;

    // сохраняем изменение только если было изменение
    if (this.lastFileChangedStatus !== this.activeFile.isChanged) {
      this.projectService.saveChange({
        guid: this.activeFile.guid,
        changes: {
          isChanged: this.activeFile.isChanged
        }
      });
    }

    this.lastFileChangedStatus = this.activeFile.isChanged;
  }

  private subscribeToProjectSaved() {
    this.electronService.ipcRenderer.on('Project:Saved', () => {
      this.lastFileChangedStatus = false;
    });
  }

}

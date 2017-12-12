import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../../core/store.service';
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

  private codeTerms = new Subject<string>();

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.initEditor();
    this.subscribeToActiveFile();
    this.subscribeToCodeChange();
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
      .subscribe(file => {
        if ( !has(file, 'originalContent') ) {
          file.originalContent = file.content;
        }

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
    this.activeFile.isChanged = this.activeFile.originalContent !== this.activeFile.content;
  }

}

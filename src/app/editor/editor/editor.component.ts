import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';
import { ResizeService } from 'app/core/resize.service';
import { GenerationService } from 'app/core/generation.service';
import { ipcRenderer } from 'electron';

import * as CodeMirror from 'CodeMirror';
import 'CodeMirror/addon/scroll/simplescrollbars';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

import * as forEach from 'lodash/forEach';
import * as has from 'lodash/has';
import * as last from 'lodash/last';
import * as isString from 'lodash/isString';

 // TODO: подумать как брать позицию откуда началось изменениe
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  @ViewChild('textarea') textarea: ElementRef;

  editor;
  mark;

  activeFile;
  lastFileChangedStatus = false;

  isCodeReviewing = false;

  private codeTerms = new Subject<string>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: StoreService,
    private projectService: ProjectService,
    private resizeService: ResizeService,
    private generationService: GenerationService
  ) { }

  ngOnInit() {
    this.initEditor();

    this.subscribeToActiveFile();
    this.subscribeToCodeChange();
    this.subscribeToProjectSaved();

    this.resizeService.initWorkspaceResizer();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveActiveFileHistory() {
    if (!this.activeFile) {
      return;
    }
    const doc = this.editor.getDoc();
    this.activeFile.history = doc.getHistory();
  }

  private initEditor() {
    this.projectService.setEditorComponent(this);

    this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers'],
      tabSize: 2,
      historyEventDelay: 450
    });

    this.generationService.setEditor(this.editor);
    this.resizeService.setEditor(this.editor);

    this.editor.on('change', (codemirror) => {
      this.codeTerms.next(codemirror.getValue());
    });
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(file => {

        this.editor.getInputField().blur();
        this.saveActiveFileHistory();

        // устанавливаем новый doc для файла
        const newDoc = CodeMirror.Doc(file.content);

        if (file.history) {
          newDoc.clearHistory();
          newDoc.setHistory(file.history);
        }

        this.editor.swapDoc(newDoc);

        if ( !has(file, 'originalContent') ) {
          file.originalContent = file.content;
        }

        this.lastFileChangedStatus = !!file.isChanged;

        this.activeFile = file;

        this.editor.setValue(file.content);
      });
  }

  private subscribeToCodeChange() {
    this.codeTerms
      .debounceTime(450)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((code) => {
        this.setNewFileContent(code);
        this.checkCode();
      });
  }

  private subscribeToProjectSaved() {
    ipcRenderer.on('project-saved', () => {
      this.lastFileChangedStatus = false;
    });
  }

  private checkCode() {
    this.isCodeReviewing = true;
    this.generationService.checkCode(this.activeFile.content)
      .finally(() => this.isCodeReviewing = false)
      .subscribe(
        (diagram) => {
          this.store.data('JSON-UML').set(diagram);
        },
        () => {
          this.store.data('JSON-UML').set(null);
        }
      );
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

}

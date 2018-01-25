import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';
import { ResizeService } from 'app/core/resize.service';
import { GenerationService } from 'app/core/generation.service';
import { ipcRenderer } from 'electron';

import ace from '../ace';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

import * as has from 'lodash/has';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

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
    const undoManager = this.editor.session.getUndoManager();
    this.activeFile.history = {
      undoStack: undoManager.$undoStack,
      redoStack: undoManager.$redoStack,
      counter: undoManager.dirtyCounter
    };
  }

  private initEditor() {
    this.projectService.setEditorComponent(this);

    this.editor = ace.edit('editor');
    this.editor.$blockScrolling = Infinity;

    this.generationService.setEditor(this.editor);
    this.resizeService.setEditor(this.editor);

    this.editor.session.on('change', (e) => {
      this.codeTerms.next(this.editor.getValue());
    });
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(file => {

        this.editor.blur();
        this.saveActiveFileHistory();

        if ( !has(file, 'originalContent') ) {
          file.originalContent = file.content;
        }

        this.lastFileChangedStatus = !!file.isChanged;

        this.activeFile = file;

        this.editor.setValue(file.content);
        this.editor.clearSelection();

        this.editor.session.setUndoManager(new ace.UndoManager());

        if (file.history) {
          const undoManager = this.editor.session.getUndoManager();

          undoManager.$doc = this.editor.getSession();
          undoManager.$redoStack = file.history.redoStack;
          undoManager.$undoStack = file.history.undoStack;
          undoManager.dirtyCounter = file.history.counter;
        }
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

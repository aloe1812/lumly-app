import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  private fromCursor;

  private chronicle = new Chronicle();
  private codeTerms = new Subject<string>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ( ($event.metaKey || $event.ctrlKey) && $event.keyCode === 90) {
      $event.preventDefault();
      if ($event.shiftKey) {
        this.chronicle.redo();
      } else {
        this.chronicle.undo();
      }
    }
  }

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

  private initEditor() {
    // Убираем горячие клавиши у editor
    forEach(['Cmd-Z', 'Cmd-Y', 'Shift-Cmd-Z'], (key) => {
      CodeMirror.keyMap.default[key] = false;
    });

    this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
      lineNumbers: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers'],
      tabSize: 2
    });

    this.generationService.setEditor(this.editor);
    this.resizeService.setEditor(this.editor);

    this.editor.on('beforeChange', () => {
      if (!this.fromCursor) {
        this.fromCursor = this.editor.getCursor();
      }
    });

    this.editor.on('change', (codemirror) => {
      if (this.chronicle.preventEditorChange()) {
        this.fromCursor = null;
        return;
      }

      this.codeTerms.next(codemirror.getValue());
    });
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(file => {

        this.chronicle.setFile(file);

        if ( !has(file, 'originalContent') ) {
          file.originalContent = file.content;
        }

        this.lastFileChangedStatus = !!file.isChanged;

        this.activeFile = file;

        this.chronicle.addToHistory(file.content, '0,0:0,0');

        this.editor.setValue(file.content);
      });
  }

  private subscribeToCodeChange() {
    // изменения через редактор
    this.codeTerms.debounceTime(450)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((code) => {
        this.setNewFileContent(code);
        this.checkCode();
      });

    // изменения через историю
    this.chronicle.onChange((cursor) => {
      if (!this.activeFile) {
        return;
      }

      this.editor.setValue(this.activeFile.content);
      this.editor.setCursor(cursor || this.editor.getCursor());

      this.saveFileChanges();
      this.checkCode();
    });
  }

  private setNewFileContent(code) {
    if (!this.activeFile) {
      return;
    }

    this.activeFile.content = code;

    this.chronicle.addToHistory(this.activeFile.content, {
      from: this.fromCursor || this.editor.getCursor(),
      to: this.editor.getCursor()
    });

    this.fromCursor = null;

    this.saveFileChanges();
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

  private saveFileChanges() {
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

class Chronicle {

  activeFile;

  private preventEditor = false;
  private callback;

  constructor() {}

  setFile(file) {
    if (!this.isChangesObjExists(file)) {
      file.changes = {
        pos: 0,
        stack: [ [file.content, '0,0;0,0'] ]
      }
    }

    this.activeFile = file;
  }

  addToHistory(value, cursors) {
    if (!this.activeFile) {
      return;
    }

    const cursorString = isString(cursors) ? cursors : `${cursors.from.line},${cursors.from.ch};${cursors.to.line},${cursors.to.ch}`;

    // если дупликат значения, то просто обновляем курсор последнего, но не добавляем новый
    if (this.activeFile.changes.stack.length && value === last(this.activeFile.changes.stack)[0]) {
      return;
    }

    // удаляем все элементы после текущего
    if (this.activeFile.changes.pos < this.activeFile.changes.stack.length - 1) {
      this.activeFile.changes.stack.splice(this.activeFile.changes.pos + 1);
    }

    if (this.activeFile.changes.stack >= 100) {
      this.activeFile.changes.stack.shift();
    }

    this.activeFile.changes.pos = this.activeFile.changes.stack.push([value, cursorString]) - 1;
  }

  undo() {
    if (!this.canUndo()) {
      return;
    }

    const current = this.activeFile.changes.stack[this.activeFile.changes.pos];

    this.activeFile.changes.pos--;
    this.setContent('undo', current);
  }

  redo() {
    if (!this.canRedo()) {
      return;
    }

    this.activeFile.changes.pos++;
    this.setContent('redo');
  }

  onChange(callback) {
    this.callback = callback;
  }

  // предотавращаем изменения поле редактора (после обновления поле редактора)
  preventEditorChange() {
    if (this.preventEditor) {
      this.preventEditor = false;
      return true;
    } else {
      return false;
    }
  }

  private setContent(type, current?) {
    this.activeFile.content = this.activeFile.changes.stack[this.activeFile.changes.pos][0];
    this.preventEditor = true;

    let cursor;

    if (type === 'undo' && current) {
      const cursors = current[1].split(';');
      cursor = cursors[0].split(',');
    } else {
      const cursors = this.activeFile.changes.stack[this.activeFile.changes.pos][1].split(';');
      cursor = cursors[1].split(',');
    }

    cursor = {
      line: cursor[0],
      ch: cursor[1]
    }

    this.callback(cursor);
  }

  private canUndo(): boolean {
    if (!this.activeFile) {
      return false;
    }

    if (this.activeFile.changes.pos === 0) {
      return false;
    }

    return true;
  }

  private canRedo(): boolean {
    if (!this.activeFile) {
      return false;
    }

    if (this.activeFile.changes.pos >= this.activeFile.changes.stack.length - 1) {
      return false;
    }

    return true;
  }

  private isChangesObjExists(file): boolean {
    if (!file) {
      return false;
    }

    if (!file.changes || !(typeof file.changes === 'object')) {
      return false;
    }

    if (!file.changes.pos || !file.changes.stack || !Array.isArray(file.changes.stack)) {
      return false;
    }

    return true;
  }

}

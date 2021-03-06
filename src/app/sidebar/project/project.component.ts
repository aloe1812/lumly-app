import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../..//core/store.service';
import { FileService } from 'app/core/file.service';
import { DragService } from 'app/core/drag.service';
import { ProjectService } from 'app/core/project.service';
import { PlaygroundComponent } from '../playground/playground.component';
import * as remove from 'lodash/remove';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  @ViewChild(PlaygroundComponent) playground: PlaygroundComponent;

  project;
  files;
  activeFile;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: StoreService,
    private dragService: DragService,
    private elementRef: ElementRef,
    private fileService: FileService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.dragService.init(this);

    this.initProject();
    this.subscribeToFileEvents();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilesDelete(data) {
    if (data.selectedFile) {
      this.playground.select();
    }

    if (!data.wasDeleted) {
      remove(this.files, data.file);
    }
  }

  sortFiles() {
    this.fileService.sortFiles(this.files);
  }

  private initProject() {
    this.playground.select();
    this.project = this.projectService.project;
    this.files = this.project.content.files;
    this.sortFiles();
  }

  private subscribeToFileEvents() {
    this.store.event('File:Selected').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        file => {
          if (this.activeFile) {
            this.activeFile.isSelected = false;
          }
          file.isSelected = true;
          this.activeFile = file;
        }
      );

    this.store.event('File:Add').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => {
          this.addFile();
        }
      )
  }

  private addFile() {
    const file = {
      type: 'file',
      guid: ++this.project.project.guidCounter,
      title: 'Untitled',
      isNew: true,
      content: '',
      _immediateSelect: true,
      _checkPosition: true
    };

    if (this.activeFile) {
      this.activeFile.isSelected = false;
    }

    this.project.content.files.push(file);

    this.projectService.saveChange({
      guid: file.guid,
      changes: {
        isNew: true
      }
    });
  }

}

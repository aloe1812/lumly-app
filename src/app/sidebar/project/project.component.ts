import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../..//core/store.service';
import { FileService } from 'app/core/file.service';
import { DragService } from 'app/core/drag.service';
import { ProjectService } from 'app/core/project.service';
import { PlaygroundComponent } from '../playground/playground.component';
import * as remove from 'lodash/remove';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @ViewChild(PlaygroundComponent) playground: PlaygroundComponent;

  project;
  files;
  activeFile;

  constructor(
    private store: StoreService,
    private dragService: DragService,
    private elementRef: ElementRef,
    private fileService: FileService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.dragService.init(this);

    this.subscribeToActiveProject();
    this.subscribeToFileEvents();
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

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get()
      .subscribe(project => {
        this.playground.select();

        if (project) {
          this.project = project;
          this.files = project.content.files;
          this.sortFiles();
        } else {
          this.clearProject();
        }
      });
  }

  private subscribeToFileEvents() {
    this.store.event('File:Selected').get().subscribe(
      ({file}) => {
        if (this.activeFile) {
          this.activeFile.isSelected = false;
        }
        file.isSelected = true;
        this.activeFile = file;
      }
    );

    this.store.event('File:Add').get().subscribe(
      () => {
        this.addFile();
      }
    )
  }

  private clearProject() {
    this.project = null;
    this.files = null;
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

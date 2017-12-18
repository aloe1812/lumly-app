import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../..//core/store.service';
import { PlaygroundComponent } from '..//playground/playground.component';
import { DragService } from 'app/core/drag.service';
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
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.dragService.init(this);

    this.subscribeToActiveProject();
    this.subscribeToActiveFile();
  }

  onFilesDelete(data) {
    if (data.selectedFile) {
      this.playground.select();
    }

    if (!data.wasDeleted) {
      remove(this.files, data.file);
    }
  }

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get()
      .subscribe(project => {
        this.playground.select();

        if (project) {
          this.project = project;
          this.files = project.content.files;
        } else {
          this.clearProject();
        }
      });
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get().subscribe(
      ({file}) => {
        setTimeout(() => {
          if (this.activeFile) {
            this.activeFile.isSelected = false;
          }
          file.isSelected = true;
          this.activeFile = file;
        });
      }
    );
  }

  private clearProject() {
    this.project = null;
    this.files = null;
  }

}

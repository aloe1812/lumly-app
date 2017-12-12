import { Component, OnInit } from '@angular/core';
import { StoreService } from '../..//core/store.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  project;
  files;
  activeFile;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.subscribeToActiveProject();
    this.subscribeToActiveFile();
  }

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get()
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.files = project.content.files;
        } else {
          this.clearProject();
        }
      })
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get().subscribe(
      (file) => {
        if (this.activeFile) {
          this.activeFile.isSelected = false;
        }

        file.isSelected = true;
        this.activeFile = file;
      }
    );
  }

  private clearProject() {
    this.project = null;
    this.files = null;
  }

}

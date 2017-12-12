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

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.subscribeToActiveProject();
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

  private clearProject() {
    this.project = null;
    this.files = null;
  }

}

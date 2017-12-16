import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../core/electron.service';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;
  isProjectHasChanges = false;
  openProjectTitle = 'Open Project';

  constructor(
    private electronService: ElectronService,
    private store: StoreService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.subscribeToProjectChanges();
    this.subscribeToActiveProject();
  }

  openProject() {
    if (this.project) {
      this.store.event('Projects:List').emit();
    } else {
      this.projectService.openProject();
    }
  }

  saveProject() {
    this.projectService.saveProject();
  }

  private subscribeToProjectChanges() {
    this.store.data('Project:Active:HasChanges').get().subscribe(hasChanges => {
      this.isProjectHasChanges = hasChanges;
    });
  }

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get().subscribe(
      (project) => {
        this.project = project;
        this.openProjectTitle = project ? project.project.title : 'Open Project';
      }
    )
  }

}

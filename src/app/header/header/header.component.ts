import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isProjectHasChanges = false;
  activeProjectTitle = '';

  constructor(
    private store: StoreService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.subscribeToProjectChanges();
    this.subscribeToActiveProject();
  }

  openProjects() {
    this.store.event('Projects:List').emit();
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
        this.activeProjectTitle = project ? project.project.title : '';
      }
    )
  }

}

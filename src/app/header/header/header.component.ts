import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;

  constructor(
    private store: StoreService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.subscribeToActiveProject();
  }

  openProjects() {
    this.store.event('Projects:List').emit();
  }

  saveProject() {
    this.projectService.saveProject();
  }

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get().subscribe(
      (project) => {
        this.project = project;
      }
    )
  }

}

import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ProjectService } from 'app/core/project.service';

import * as forEach from 'lodash/forEach';
import * as clone from 'lodash/clone';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  host: {'class': 'default-sidenav'}
})
export class ProjectsListComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  projects;
  activeProject;

  projectsFilesCount = [];

  constructor(
    private projectService: ProjectService
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.sidenav.hide();
    }
  }

  ngOnInit() {
    this.projects = clone(this.projectService.projects);

    this.countFilesInProjects();

    this.activeProject = this.projectService.activeProject;

    this.sidenav.show();

    this.projectService.projectOpened.first().subscribe(() => {
      this.sidenav.hide();
    });
  }

  openProject() {
    this.projectService.openProject();
  }

  selectProject(project) {
    if (project !== this.activeProject) {
      this.projectService.setActive(project);
      this.sidenav.hide();
    }
  }

  private countFilesInProjects() {
    forEach(this.projects, project => {
      this.projectsFilesCount.push( filesCount(project.content.files) );
    });

    function filesCount(files) {
      let count = 0;

      forEach(files, (file) => {
        if (file.type === 'file') {
          count++;
        } else if (file.type === 'group') {
          count += filesCount(file.files);
        }
      });

      return count;
    }
  }

}

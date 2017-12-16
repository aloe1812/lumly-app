import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ProjectService } from 'app/core/project.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

import * as forEach from 'lodash/forEach';
import * as clone from 'lodash/clone';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  host: {'class': 'default-sidenav'},
  animations: [
    trigger('innerSidenavState', [
      state('hidden', style({
        display: 'none',
        visibility: 'hidden',
        transform: 'translate3d(-100%, 0, 0)'
      })),
      state('shown', style({
        display: 'block',
        visibility: 'visible',
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('* => *', animate('150ms ease'))
    ])
  ]
})
export class ProjectsListComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  projects;
  activeProject;

  projectsFilesCount = [];

  innerSidenavState = 'hidden';
  isInnerOpen = false;
  fakeSidenavRef = {
    show: () => {
      this.innerSidenavState = 'shown';
    },
    hide: (isCreated) => {
      if (isCreated) {
        this.sidenav.hide();
      } else {
        this.innerSidenavState = 'hidden';
      }
    }
  };

  constructor(
    private projectService: ProjectService
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if (!this.isInnerOpen && $event.keyCode === 27) {
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

  triggerInnerOpen() {
    this.isInnerOpen = true;
  }

  animationDone(ev) {
    if (ev.fromState === 'void' && ev.toState === 'hidden') {
      ev.element.style.width = '400px';
    }

    if (ev.fromState === 'shown' && ev.toState === 'hidden') {
      this.isInnerOpen = false;
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

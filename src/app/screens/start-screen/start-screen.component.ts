import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'app/core/project.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  projectNameCtrl = new FormControl();
  recent;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.recent = this.projectService.recentProjects;
  }

  openProject() {
    this.projectService.openProject();
  }

  openRecent(project) {
    this.projectService.openProjectFromPath(project.path, 'window-recent');
  }

  addProject() {
    if (!this.projectNameCtrl.value) {
      return;
    }

    const project = {
      project: {
        title: this.projectNameCtrl.value
      },
      content: {
        files: []
      }
    };

    this.projectService.activateProject(project, true);
  }

  onKeydown(ev) {
    // Enter
    if (ev.keyCode === 13) {
      this.addProject();
    }
  }

}

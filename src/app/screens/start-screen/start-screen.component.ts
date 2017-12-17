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
    this.projectService.projectOpened.first().subscribe(() => {
      this.router.navigateByUrl('/main');
    });

    this.recent = this.projectService.recent;
  }

  openProject() {
    this.projectService.openProject();
  }

  openRecent(project) {
    this.projectService.openRecentProject(project);
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

    this.projectService.prepareProject(project, true);
    this.projectService.storeProject(project);
    this.projectService.setActive(project);

    this.router.navigateByUrl('/main');
  }

  onKeydown(ev) {
    // Enter
    if (ev.keyCode === 13) {
      this.addProject();
    }
  }

}

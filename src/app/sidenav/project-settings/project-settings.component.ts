import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'app/core/project.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
  host: {'class': 'default-sidenav add-sidenav'}
})
export class ProjectSettingsComponent implements OnInit {

  @Input() sidenav: any;

  project;
  projectNameCtrl = new FormControl();

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
    this.project = this.projectService.project;
    this.projectNameCtrl.setValue(this.project.project.title);
    this.sidenav.show();
  }

  saveProjectTitle() {
    if (!this.projectNameCtrl.value) {
      return;
    }

    this.project.project.title = this.projectNameCtrl.value;

    this.projectService.saveChange({
      guid: 'PROJECT_SELF',
      changes: {
        isTitleChanged: this.project.project.title !== this.project.project.originalTitle
      }
    });
  }

  onKeydown(ev) {
    if (ev.keyCode === 13) {
      this.saveProjectTitle();
    }
  }

  goBack() {
    this.sidenav.hide();
  }

}

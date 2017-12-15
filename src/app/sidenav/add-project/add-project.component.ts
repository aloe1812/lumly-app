import { Component, OnInit, Input, HostListener, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'default-sidenav add-sidenav'}
})
export class AddProjectComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  projectNameCtrl = new FormControl();

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.sidenav.hide();
    }
  }

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.sidenav.show();
  }

  addProject() {
    if (!this.projectNameCtrl.value) {
      this.sidenav.hide();
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

    this.sidenav.hide();
  }

}

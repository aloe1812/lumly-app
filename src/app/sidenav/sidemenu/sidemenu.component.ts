import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SidenavComponent } from 'app/sidenav/sidenav/sidenav.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProjectService } from 'app/core/project.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  host: {'class': 'default-sidenav sidemenu'},
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
export class SidemenuComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  project;
  projectSettingsState = 'hidden';
  isProjectSettingsOpen = false;

  fakeSidenavRef = {
    show: () => {
      this.projectSettingsState = 'shown';
    },
    hide: () => {
      this.projectSettingsState = 'hidden';
    }
  };

  constructor(
    private projectService: ProjectService
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if (!this.isProjectSettingsOpen && $event.keyCode === 27) {
      $event.preventDefault();
      this.sidenav.hide();
    }
  }

  ngOnInit() {
    this.project = this.projectService.project;
    this.sidenav.show();
  }

  toggleProjectSettings() {
    if (this.isProjectSettingsOpen) {
      this.fakeSidenavRef.hide();
    } else {
      this.isProjectSettingsOpen = true;
    }
  }

  animationDone(ev) {
    if (ev.fromState === 'void' && ev.toState === 'hidden') {
      ev.element.style.width = '400px';
    }

    if (ev.fromState === 'shown' && ev.toState === 'hidden') {
      this.isProjectSettingsOpen = false;
    }
  }

  close() {
    this.sidenav.hide();
  }

}

import { Component } from '@angular/core';
import { SvgIconService } from './svg-icon/svg-icon.service';
import { StoreService } from './core/store.service';
import * as forEach from 'lodash/forEach';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAddFolderOpen = false;
  isAddProjectOpen = false;
  isProjectsListOpen = false;

  private icons = [
    ['file', 'assets/icons/file.svg'],
    ['arrow-round', 'assets/icons/arrow-round.svg'],
    ['expand-arrow', 'assets/icons/expand-arrow.svg'],
    ['beach-ball', 'assets/icons/beach-ball.svg'],
    ['plus', 'assets/icons/plus.svg'],
    ['view-bars', 'assets/icons/view-bars.svg'],
    ['more', 'assets/icons/more.svg']
  ];

  constructor(
    private svgIconService: SvgIconService,
    private store: StoreService
  ) {
    forEach(this.icons, icon => {
      svgIconService.registerIcon(icon);
    });

    this.subscribeToSidenavEvents();
  }

  private subscribeToSidenavEvents() {
    this.store.event('Folder:Add').get().subscribe(() => {
      this.isAddFolderOpen = true;
    });
    this.store.event('Project:Add').get().subscribe(() => {
      this.isAddProjectOpen = true;
    });
    this.store.event('Projects:List').get().subscribe(() => {
      this.isProjectsListOpen = true;
    });
  }

  onSidenavHidden() {
    this.isAddFolderOpen = false;
    this.isAddProjectOpen = false;
    this.isProjectsListOpen = false;
  }

}

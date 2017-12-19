import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  isAddFolderOpen = false;
  isAddProjectOpen = false;
  isProjectsListOpen = false;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.subscribeToSidenavEvents();
  }

  onSidenavHidden() {
    this.isAddFolderOpen = false;
    this.isAddProjectOpen = false;
    this.isProjectsListOpen = false;
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

}
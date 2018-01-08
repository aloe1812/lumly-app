import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/project.service';
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;

  constructor(
    private projectService: ProjectService,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.project = this.projectService.project;
  }

  openSidemenu() {
    this.store.event('Sidemenu:Open').emit();
  }

}

import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.project = this.projectService.project;
  }

}

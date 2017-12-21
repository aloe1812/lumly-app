import { Component, OnInit } from '@angular/core';
import { ResizeService } from 'app/core/resize.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.resizeService.initSidebarResizer();
  }

}

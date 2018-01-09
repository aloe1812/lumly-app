import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResizeService } from 'app/core/resize.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  isSidebarOpen = true;
  isDiagramOpen = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.resizeService.resizerEvents
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.isSidebarOpen = data.isSidebarOpen;
        this.isDiagramOpen = data.isDiagramOpen;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleSidebar() {
    this.resizeService.toggleSidebar();
  }

  toggleDiagram() {
    this.resizeService.toggleDiagram();
  }

}

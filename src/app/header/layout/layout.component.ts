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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.resizeService.onSidebarToggle
      .takeUntil(this.ngUnsubscribe)
      .subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleSidebar() {
    this.resizeService.toggleSidebar();
  }

}

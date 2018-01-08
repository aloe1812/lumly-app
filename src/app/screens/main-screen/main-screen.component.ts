import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { ResizeService } from 'app/core/resize.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit, OnDestroy {

  isAddFolderOpen = false;
  isSidemenuOpen = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: StoreService,
    private elementRef: ElementRef,
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.resizeService.init(this.elementRef.nativeElement);
    this.subscribeToSidenavEvents();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSidenavHidden() {
    this.isAddFolderOpen = false;
    this.isSidemenuOpen = false;
  }

  private subscribeToSidenavEvents() {
    this.store.event('Folder:Add').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.isAddFolderOpen = true;
      });

    this.store.event('Sidemenu:Open').get()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.isSidemenuOpen = true;
      });
  }

}

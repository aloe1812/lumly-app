import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { ResizeService } from 'app/core/resize.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit, OnDestroy {

  isAddFolderOpen = false;
  private sub: Subscription;

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
    this.sub.unsubscribe();
  }

  onSidenavHidden() {
    this.isAddFolderOpen = false;
  }

  private subscribeToSidenavEvents() {
    this.sub = this.store.event('Folder:Add').get()
      .subscribe(() => {
        this.isAddFolderOpen = true;
      });
  }

}

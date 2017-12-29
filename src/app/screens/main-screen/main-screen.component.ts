import { Component, OnInit, ElementRef } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { ResizeService } from 'app/core/resize.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  isAddFolderOpen = false;

  constructor(
    private store: StoreService,
    private elementRef: ElementRef,
    private resizeService: ResizeService
  ) { }

  ngOnInit() {
    this.resizeService.init(this.elementRef.nativeElement);
    this.subscribeToSidenavEvents();
  }

  onSidenavHidden() {
    this.isAddFolderOpen = false;
  }

  private subscribeToSidenavEvents() {
    this.store.event('Folder:Add').get().subscribe(() => {
      this.isAddFolderOpen = true;
    });
  }

}

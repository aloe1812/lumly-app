import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '../../core/utils.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'menu-container'}
})
export class MenuComponent implements OnInit, AfterViewInit {

  @Input() event;
  @Input() items;

  @Output() destroy: EventEmitter<any> = new EventEmitter();

  constructor(
    private utils: UtilsService,
    private elRef: ElementRef,
  ) { }

  ngOnInit() {
    this.items.forEach(item => {
      if (!item.class) {
        item.class = '';
      }
    });
  }

  ngAfterViewInit() {
    const position = this.utils.calculateMenuPosition({
      eventX: this.event.clientX,
      eventY: this.event.clientY,
      menuWidth: this.elRef.nativeElement.offsetWidth + 1,
      menuHeight: this.elRef.nativeElement.offsetHeight + 1
    });

    this.elRef.nativeElement.style.left = position.x + 'px';
    this.elRef.nativeElement.style.top = position.y + 'px';
    this.elRef.nativeElement.style.opacity = 1;
  }

  select(item) {
    this.destroy.emit(item.type);
  }

  close() {
    this.destroy.emit();
  }

}

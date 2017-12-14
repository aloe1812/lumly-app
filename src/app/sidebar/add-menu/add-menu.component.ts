import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
  host: {'class': 'add-menu-container'}
})
export class AddMenuComponent implements OnInit {

  @Input() items;

  @Output() destroy: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  select(item) {
    this.destroy.emit(item.type);
  }

  close() {
    this.destroy.emit();
  }

}

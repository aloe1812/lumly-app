import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
  host: {'class': 'modal-window modal-delete'}
})
export class ConfirmDeleteComponent implements OnInit {

  @Input() title = 'item';
  @Output() destroy: EventEmitter<any> = new EventEmitter();

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.close();
    }
  }

  ngOnInit() {
  }

  close() {
    this.destroy.emit(false);
  }

  delete() {
    this.destroy.emit(true);
  }

}

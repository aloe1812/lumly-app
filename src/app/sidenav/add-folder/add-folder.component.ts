import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss'],
  host: {'class': 'default-sidenav'}
})
export class AddFolderComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.sidenav.hide();
    }
  }

  constructor() { }

  ngOnInit() {
    this.sidenav.show();
  }

}

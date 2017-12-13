import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  file = {
    content: '',
    isSelected: true,
    type: 'playground'
  };
  path = 'Playground';

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.select(true);
  }

  select(force = false) {
    if (!force && this.file.isSelected) {
      return;
    }

    this.store.event('File:Selected').emit({
      file: this.file,
      path: this.path
    });
  }

}

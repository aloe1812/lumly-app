import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  project;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.store.data('Project:Active').get()
      .subscribe(project => {
        this.project = project;
      });
  }

}

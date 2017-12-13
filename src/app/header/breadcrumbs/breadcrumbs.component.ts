import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  path;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.subscribeToActiveFile();
  }

  private subscribeToActiveFile() {
    this.store.event('File:Selected').get()
      .subscribe(data => {
        if (data) {
          setTimeout(() => {
            this.path = data.path.split('.')
          });
        } else {
          this.path = null;
        }
      });
  }

}

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

  // TODO: разобраться почему тут вылетает ошибка ExpressionChangedAfterItHasBeenCheckedError
  private subscribeToActiveFile() {
    this.store.event('File:Show:Path').get()
      .subscribe(path => {
        if (path) {
          setTimeout(() => { this.path = path; });
        } else {
          this.path = null;
        }
      });
  }

}

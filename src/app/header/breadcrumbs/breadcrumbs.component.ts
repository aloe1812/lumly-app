import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  path;
  private sub: Subscription;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit() {
    this.subscribeToActiveFile();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // TODO: разобраться почему тут вылетает ошибка ExpressionChangedAfterItHasBeenCheckedError
  private subscribeToActiveFile() {
    this.sub = this.store.event('File:Show:Path').get()
      .subscribe(path => {
        if (path) {
          setTimeout(() => { this.path = path; });
        } else {
          this.path = null;
        }
      });
  }

}

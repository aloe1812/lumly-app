import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { InjectionService } from '../../core/injection.service';
import { AddMenuComponent } from '../../sidebar/add-menu/add-menu.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  project;

  constructor(
    private store: StoreService,
    private injector: InjectionService
  ) { }

  ngOnInit() {
    this.store.data('Project:Active').get()
      .subscribe(project => {
        this.project = project;
      });
  }

  openAddMenu() {
    let menuItems;

    if (this.project) {
      menuItems = [
        {
          title: 'File',
          type: 'add-file'
        },
        {
          title: 'Folder',
          type: 'add-folder'
        },
        {
          title: 'Project',
          type: 'add-project'
        }
      ];
    } else {
      menuItems = [
        {
          title: 'Project',
          type: 'add-project'
        }
      ];
    }

    this.injector.appendComponent(AddMenuComponent, {
      items: menuItems
    }).instance.destroy.first()
      .subscribe(evType => {
        if (!evType) {
          return;
        }

        console.log(evType);
      })
  }

}

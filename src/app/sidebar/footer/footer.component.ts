import { Component } from '@angular/core';
import { StoreService } from '../../core/store.service';
import { InjectionService } from '../../core/injection.service';
import { AddMenuComponent } from '../../sidebar/add-menu/add-menu.component';
import { ProjectService } from 'app/core/project.service';
import { ResizeService } from 'app/core/resize.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private store: StoreService,
    private injector: InjectionService,
    private projectService: ProjectService,
    private resizeService: ResizeService
  ) { }

  openAddMenu() {
    const menuItems = [
      {
        title: 'File',
        type: 'add-file'
      },
      {
        title: 'Folder',
        type: 'add-folder'
      }
    ];

    this.injector.appendComponent(AddMenuComponent, {
      items: menuItems
    }).instance.destroy.first()
      .subscribe(evType => {
        if (!evType) {
          return;
        }

        if (evType === 'add-file') {
          this.store.event('File:Add').emit();
        }

        if (evType === 'add-folder') {
          this.store.event('Folder:Add').emit();
        }
      });
  }

  hideSidebar() {
    this.resizeService.hideSidebar();
  }

}

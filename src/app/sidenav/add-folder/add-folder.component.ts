import { Component, OnInit, Input, HostListener, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'default-sidenav add-sidenav'}
})
export class AddFolderComponent implements OnInit {

  @Input() sidenav: SidenavComponent;

  project;
  folderNameCtrl = new FormControl();

  @HostListener('document:keydown', ['$event'])
  handleKeyEvent($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.sidenav.hide();
    }
  }

  constructor(
    private store: StoreService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.sidenav.show();
    this.store.data('Project:Active').get().first()
      .subscribe(project => this.project = project);
  }

  onKeydown(ev) {
    if (ev.keyCode === 13) {
      this.addFolder();
    }
  }

  addFolder() {
    if (!this.folderNameCtrl.value) {
      return;
    }

    const folder = {
      type: 'group',
      guid: ++this.project.project.guidCounter,
      title: this.folderNameCtrl.value,
      isNew: true,
      files: [],
      _checkPosition: true
    };

    this.project.content.files.push(folder);

    this.projectService.saveChange({
      guid: folder.guid,
      changes: {
        isNew: true
      }
    });

    this.sidenav.hide();
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavComponent } from './sidenav/sidenav.component';
import { AddFolderComponent } from './add-folder/add-folder.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SidenavComponent,
    AddFolderComponent
  ],
  exports: [
    SidenavComponent,
    AddFolderComponent
  ]
})
export class SidenavModule { }

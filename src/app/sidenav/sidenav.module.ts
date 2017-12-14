import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidenavComponent } from './sidenav/sidenav.component';
import { AddFolderComponent } from './add-folder/add-folder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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

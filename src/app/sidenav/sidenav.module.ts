import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';

import { SidenavComponent } from './sidenav/sidenav.component';
import { AddFolderComponent } from './add-folder/add-folder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconModule
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

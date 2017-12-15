import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidenavComponent } from './sidenav/sidenav.component';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { AddProjectComponent } from './add-project/add-project.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SidenavComponent,
    AddFolderComponent,
    AddProjectComponent
  ],
  exports: [
    SidenavComponent,
    AddFolderComponent,
    AddProjectComponent
  ]
})
export class SidenavModule { }

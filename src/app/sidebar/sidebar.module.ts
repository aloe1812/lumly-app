import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectComponent } from './project/project.component';
import { FileComponent } from './file/file.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarComponent, ProjectComponent, FileComponent],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }

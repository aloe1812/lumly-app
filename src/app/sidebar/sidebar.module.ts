import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { SharedModule } from '../shared/shared.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectComponent } from './project/project.component';
import { FileComponent } from './file/file.component';
import { PlaygroundComponent } from './playground/playground.component';
import { FileRenameComponent } from './file-rename/file-rename.component';
import { FooterComponent } from './footer/footer.component';
import { AddMenuComponent } from './add-menu/add-menu.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule,
    SharedModule
  ],
  declarations: [
    SidebarComponent,
    ProjectComponent,
    FileComponent,
    PlaygroundComponent,
    FileRenameComponent,
    FooterComponent,
    AddMenuComponent
  ],
  exports: [
    SidebarComponent
  ],
  entryComponents: [
    AddMenuComponent
  ]
})
export class SidebarModule { }

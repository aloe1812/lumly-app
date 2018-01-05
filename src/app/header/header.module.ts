import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';
import { HeaderComponent } from './header/header.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ProjectStatusComponent } from './project-status/project-status.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [HeaderComponent, BreadcrumbsComponent, ProjectStatusComponent],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }

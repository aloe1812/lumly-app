import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';
import { HeaderComponent } from './header/header.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [EditorComponent, HeaderComponent, BreadcrumbsComponent],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }

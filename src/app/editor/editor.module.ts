import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [EditorComponent],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }

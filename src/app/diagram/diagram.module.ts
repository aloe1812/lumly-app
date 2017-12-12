import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram/diagram.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DiagramComponent],
  exports: [
    DiagramComponent
  ]
})
export class DiagramModule { }

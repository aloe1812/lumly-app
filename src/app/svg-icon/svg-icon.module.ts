import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from './svg-icon.component';
import { SvgIconService } from './svg-icon.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SvgIconService
  ],
  declarations: [
    SvgIconComponent
  ],
  exports: [
    SvgIconComponent
  ]
})
export class SvgIconModule { }

export { SvgIconService } from './svg-icon.service';

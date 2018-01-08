import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';

import { DiagramComponent } from './diagram/diagram.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [DiagramComponent, HeaderComponent, FooterComponent],
  exports: [
    DiagramComponent
  ]
})
export class DiagramModule { }

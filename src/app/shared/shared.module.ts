import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from './menu.service';

import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MenuComponent
  ],
  providers: [
    MenuService
  ],
  entryComponents: [
    MenuComponent
  ]
})
export class SharedModule { }

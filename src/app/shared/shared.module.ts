import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUiUtilsService } from './shared-ui-utils.service';

import { MenuComponent } from './menu/menu.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MenuComponent,
    ConfirmDeleteComponent
  ],
  providers: [
    SharedUiUtilsService
  ],
  entryComponents: [
    MenuComponent,
    ConfirmDeleteComponent
  ]
})
export class SharedModule { }

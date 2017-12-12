import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronService } from './electron.service';
import { StoreService } from './store.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService,
    StoreService
  ],
  declarations: []
})
export class CoreModule { }

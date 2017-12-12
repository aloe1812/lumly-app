import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronService } from './electron.service';
import { StoreService } from './store.service';
import { ProjectService } from './project.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService,
    StoreService,
    ProjectService
  ],
  declarations: []
})
export class CoreModule { }

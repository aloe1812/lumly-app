import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ElectronService } from './electron.service';
import { StoreService } from './store.service';
import { ProjectService } from './project.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ElectronService,
    StoreService,
    ProjectService
  ],
  declarations: []
})
export class CoreModule { }

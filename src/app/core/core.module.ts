import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ElectronService } from './electron.service';
import { StoreService } from './store.service';
import { ProjectService } from './project.service';
import { InjectionService } from './injection.service';
import { UtilsService } from './utils.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ElectronService,
    StoreService,
    ProjectService,
    InjectionService,
    UtilsService
  ],
  declarations: []
})
export class CoreModule { }

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { StoreService } from './store.service';
import { ProjectService } from './project.service';
import { InjectionService } from './injection.service';
import { UtilsService } from './utils.service';
import { FileService } from './file.service';
import { InitializationService } from './initialization.service';
import { DragService } from './drag.service';
import { ResizeService } from 'app/core/resize.service';
import { GenerationService } from 'app/core/generation.service';

export function initService(init: InitializationService) {
  return () => init.initApp();
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    StoreService,
    ProjectService,
    InjectionService,
    UtilsService,
    FileService,
    InitializationService,
    DragService,
    ResizeService,
    GenerationService,

    {
      provide: APP_INITIALIZER,
      useFactory: initService,
      deps: [InitializationService],
      multi: true
    }
  ]
})
export class CoreModule { }

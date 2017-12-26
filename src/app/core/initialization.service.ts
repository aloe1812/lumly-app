import { Injectable } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { ipcRenderer } from 'electron';

@Injectable()
export class InitializationService {

  constructor(
    private projectService: ProjectService
  ) { }

  // Перед загрузкой приложения берем загружаем данные о недавних файлах
  initApp() {
    return new Promise(resolve => {
      ipcRenderer.send('Store:Get:Recent');

      ipcRenderer.on('Store:Got:Recent', (ev, data) => {
        this.projectService.recent = data ? data : [];
        ipcRenderer.removeAllListeners('Store:Got:Recent');
        resolve();
      });
    });
  }

}

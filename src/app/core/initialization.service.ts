import { Injectable } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { ElectronService } from 'app/core/electron.service';

@Injectable()
export class InitializationService {

  constructor(
    private projectService: ProjectService,
    private electronService: ElectronService
  ) { }

  // Перед загрузкой приложения берем загружаем данные о недавних файлах
  initApp() {
    return new Promise(resolve => {
      this.electronService.ipcRenderer.send('Store:Get:Recent');

      this.electronService.ipcRenderer.on('Store:Got:Recent', (ev, data) => {
        this.projectService.recent = data ? data : [];
        this.electronService.ipcRenderer.removeAllListeners('Store:Got:Recent');
        resolve();
      });
    });
  }

}

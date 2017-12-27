import { Injectable } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { ipcRenderer, remote } from 'electron';

@Injectable()
export class InitializationService {

  constructor(
    private projectService: ProjectService
  ) {
    ipcRenderer.once('Window:Before-Close', (ev) => {
      const recent = this.projectService.getRecentProjects();
      ipcRenderer.send('SaveRecentAndClose', recent);
    });
  }

  // Перед загрузкой приложения берем загружаем данные о недавних файлах
  initApp() {
    return new Promise(resolve => {
      this.projectService.recent = ipcRenderer.sendSync('Store:Get:Recent');
      resolve();
    });
  }

}

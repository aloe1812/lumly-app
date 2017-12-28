import { Injectable } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { ipcRenderer, remote } from 'electron';
import * as forEach from 'lodash/forEach';

@Injectable()
export class InitializationService {

  private currentWindow = remote.getCurrentWindow();

  constructor(
    private projectService: ProjectService
  ) {
    ipcRenderer.once('Window:Before-Close', (ev) => {
      const recentProjects = this.projectService.getRecentProjects();
      const isSaved = ipcRenderer.sendSync('Save:Recent', recentProjects);
      if (isSaved) {
        this.currentWindow.close();
      }
    });
  }

  // Перед загрузкой приложения берем загружаем данные о недавних файлах
  initApp() {
    return new Promise(resolve => {
      const windowData = (<any>this.currentWindow).customWindowData;

      document.body.classList.add(windowData.platform);
      this.projectService.recentProjects = windowData.recentFiles;

      if (windowData.path) {
        this.projectService.openProjectFromFile(windowData.path);
      } else if (windowData.projectData) {
        this.projectService.openProjectFromData(windowData.projectData);
      } else {
        this.projectService.openEmpty();
      }

      resolve();
    });
  }

}

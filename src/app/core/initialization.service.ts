import { Injectable } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { ipcRenderer, remote } from 'electron';
import * as forEach from 'lodash/forEach';

@Injectable()
export class InitializationService {

  private currentWindow = remote.getCurrentWindow();

  constructor(
    private projectService: ProjectService
  ) {}

  // Перед загрузкой приложения берем загружаем данные о недавних файлах
  initApp() {
    return new Promise(resolve => {
      const windowData = (<any>this.currentWindow).customWindowData;

      document.body.classList.add(windowData.platform);
      this.projectService.recentProjects = windowData.recentFiles;

      if (windowData.path) {
        this.projectService.openProjectFromPath(windowData.path, 'file');
      } else if (windowData.projectData) {
        this.projectService.openProjectFromData(JSON.parse(windowData.projectData));
      } else {
        this.projectService.openEmpty();
      }

      resolve();
    });
  }

}

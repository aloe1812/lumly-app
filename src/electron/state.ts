import { Menu, app, BrowserWindow, ipcMain } from 'electron';
import { store } from './store';
import * as _ from 'lodash';

// Класс который получает/сохраняет состояние приложения (открыте проекты) после открытия/закрытия
class AppStateClass {

  isSaved = false;
  isSaving = false;

  private storedProjects = [];

  private projectsCount;
  private projectsToStore = [];

  constructor() {
    this.storedProjects = store.get('openProjects', []);
    this.subToEvents();
  }

  // сохраняем состояние приложения
  saveState() {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const allWindows = BrowserWindow.getAllWindows();
    this.projectsCount = allWindows.length;

    _.forEach(allWindows, (win) => {
      this.getWindowData(win);
    });
  }

  restore(createWindow, hasOpenFromPath = false) {
    _.forEach(this.storedProjects, project => {
      createWindow({projectData: JSON.stringify(project)});
    });

    if (hasOpenFromPath) {
      return;
    } else if (!this.storedProjects.length) {
      createWindow();
    }
  }

  private getWindowData(win) {
    // удаляем все события отлавливающие закрытие приложения
    win.webContents.removeAllListeners('will-prevent-unload');
    win.removeAllListeners('close');

    // на всякий случай предотвращаем незакртие окна из-за onbeforeunload
    win.webContents.on('will-prevent-unload', (ev) => {
      ev.preventDefault();
    });

    // предотваращаем текущее закрытие окна (так как этот метод вызывает при закртии приложения)
    win.once('close', (ev) => {
      if (!this.isSaved) {
        ev.preventDefault();
      }
    });

    win.webContents.send('get-project');
  }

  private subToEvents() {
    ipcMain.on('got-project', (ev, data) => {
      this.projectsCount--;

      if (data.project) {
        this.projectsToStore.push(data.project)
      }

      // информация от всех окон пришла => закрываем приложение
      if (this.projectsCount === 0) {
        store.set('openProjects', this.projectsToStore);
        this.isSaved = true;

        app.quit();
      }
    });
  }

}

export const AppState = new AppStateClass();

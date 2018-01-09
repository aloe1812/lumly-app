import { Menu, MenuItem, app, BrowserWindow, ipcMain, shell, dialog, screen } from 'electron';
import { topMenuEvents, contextMenu, fileContextMenu } from './electron/menu';
import { recents } from './electron/store';
import { getWindowBounds } from './electron/utils';
import * as log from 'electron-log';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

log.transports.file.level = 'info'; // tmp

let openedFromPath;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {});
}

// Сохраняем ссылку на глобальный объект окна, в противном случае окно будет закрыто
// автоматически, когда сборщик мусора удалит объект
const windows = [];

// Различного рода перемененные
const dataForWindow = {
  platform: process.platform,
  recentFiles: []
}

// Функция для создания окна приложения
function createWindow(data?) {

  const bounds = getWindowBounds();

  dataForWindow.recentFiles = recents.get();

  let win = new BrowserWindow({
    title: 'lumly',
    backgroundColor: '#111111',
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: bounds.minWidth,
    minHeight: bounds.minHeight,
    webPreferences: {
      nodeIntegration: true
    }
  });

  windows.push(win);

  (<any>win).customWindowData = Object.assign({}, dataForWindow, data);

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools
  if (serve) {
    win.webContents.openDevTools();
  }

  // Если закрыли окно, очишаем его и удаляем из массива
  win.on('closed', function () {
    const winIndex = windows.indexOf(win);

    if (winIndex !== -1) {
      windows.splice(winIndex, 1);
    }

    win = null;
  });
}

// Как только приложение закончило загружаться, подписываемся на открыть событие открыть файл
app.on('will-finish-launching', () => {
  app.on('open-file', (event, filePath) => {
    event.preventDefault();

    if (windows.length) {
      if (!showWindowIfPathAlreadyOpen(filePath)) {
        createWindow({path: filePath});
      }
    } else {
      openedFromPath = filePath;
    }
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (openedFromPath) {
    createWindow({path: openedFromPath});
  } else {
    createWindow();
  }
});

// Закрыть приложение, если закрыли все окна
app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!windows.length) {
    createWindow();
  }
});

// Сохраняем список недавних в файл
app.on('quit', () => {
  recents.saveToStore();
});

// Показываем контекстное меню
app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    contextMenu.popup(win, {
      x: params.x,
      y: params.y
    });
  });
});

ipcMain.on('show-context-menu', function (event, params) {
  const win = BrowserWindow.fromWebContents(event.sender);
  contextMenu.popup(win);
});

ipcMain.on('file-open-context-menu', function (event, params) {
  const win = BrowserWindow.fromWebContents(event.sender);
  fileContextMenu.popup(win, {
    x: params.x,
    y: params.y
  });
});

/***********************************************
* ============ События приложения ============ *
***********************************************/
topMenuEvents.on('open-project', (data) => {
  let window;

  if (data.window) {
    window = data.window;
  } else {
    window = _.find(windows, win => {
      return !win.isDestroyed();
    });
  }

  if (data.path) {
    openProjectByPath(window, data.path, data.origin);
  } else {
    openProjectFromDialog(window, data.origin);
  }
});

topMenuEvents.on('new-project', () => {
  createWindow();
});

// указываем что у окна есть активный проект (либо новый, либо путь)
ipcMain.on('set-window-project-active', (event, data) => {
  const window = BrowserWindow.fromId(data.windowId);

  if (data.clearProject) {
    delete (<any>window).customWindowData.isProjectNew;
    delete (<any>window).customWindowData.projectPath;
  } else if (data.projectPath) {
    recents.add(data.projectPath);
    delete (<any>window).customWindowData.isProjectNew;
    (<any>window).customWindowData.projectPath = data.projectPath;
  } else {
    delete (<any>window).customWindowData.projectPath;
    (<any>window).customWindowData.isProjectNew = true;
  }
});

ipcMain.on('open-project-file-dialog', (event, data) => {
  openProjectFromDialog(event.sender, data.origin);
});

ipcMain.on('open-project-file', (ev, data) => {
  openProjectByPath(ev.sender, data.path, data.origin);
});

function openProjectFromDialog(sender, origin) {
  const dialogProps: any = {
    filters: {
      name: 'Lumly project',
      extensions: ['lumly']
    },
    properties: ['openFile']
  };

  dialog.showOpenDialog(dialogProps, (filePaths) => {
    if (!filePaths) {
      return;
    }

    openProjectByPath(sender, filePaths[0], origin);
  });
}

/*
  sender - окно куда отправлять данные и ошибки (не факт что от этого окна изначально пришел запрос)
  origin - из какого блока пришел запрос на отркытие файла. может быть:
    * menu - из верхнего меню
    * file - закинули файл или открыли файл
    * window - из открытого уже окна
*/
function openProjectByPath(sender, filePath, origin) {
  // не валидное расширение файла, отправляем ошибку
  if (path.extname(filePath) !== '.lumly') {
    sender.webContents.send('open-project-file:error', {type: 'ext', origin});
    return;
  }

  // проверяем, есть ли уже окно с таким путем
  // не проверяем если открыто через файл, так как в этом случае, мы уже это проверили в событии 'open-file' выше
  if (origin !== 'file' && showWindowIfPathAlreadyOpen(filePath)) {
    return;
  }

  fs.readFile(filePath, 'utf8', (err, contents) => {
    if (err) {
      if (origin === 'window-recent' || origin === 'menu-recent') {
        recents.remove(filePath);
        sender.webContents.send('open-project-file:error', {type: 'general', origin, recentFiles: recents.get()});
      } else {
        sender.webContents.send('open-project-file:error', {type: 'general', origin});
      }

      return;
    }

    const project = parseProjectFile(contents);

    if (project) { // проект валидный
      project.project.path = filePath;

      // если открываем через меню и в текущем окне уже есть проект
      if ( (origin === 'menu' || origin === 'menu-recent') &&
          sender.customWindowData &&
          (sender.customWindowData.projectPath || sender.customWindowData.isProjectNew)
        ) {
        createWindow({projectData: JSON.stringify(project)});
      } else {
        sender.webContents.send('project-file-opened', {
          project,
          origin
        });
      }
    } else { // проект не валидный
      sender.webContents.send('open-project-file:error', {
        type: 'invalid',
        origin
      });
    }
  });
}

function parseProjectFile(fileContents) {

  try {
    const project = JSON.parse(fileContents);

    if (!isProjectFileValid(project)) {
      throw Error;
    }

    return project;
  } catch (e) {
    return null;
  }

  function isProjectFileValid(project) {
    if (!( _.has(project, 'project') &&
           _.has(project, 'content') &&
           _.has(project, 'project.title') &&
           _.has(project, 'content.files')
    )) {
      return false;
    }

    if (!_.isString(project.project.title)) {
      return false;
    }

    if (!_.isArray(project.content.files)) {
      return false;
    }

    return true;
  }

}

function showWindowIfPathAlreadyOpen(filePath): boolean {

  if (windows.length) {
    let isWindowFound = false;

    _.forEach(windows, window => {
      if (
        (<any>window).customWindowData &&
        (<any>window).customWindowData.projectPath &&
        (<any>window).customWindowData.projectPath === filePath
      ) {
        window.show();
        isWindowFound = true;
        return false;
      }
    });

    return isWindowFound;
  } else {
    return false;
  }
}


/*********** Сохранение проекта ***************/

// Сохраняем проект
ipcMain.on('project-save', (event, data) => {

  // проверяем что путь файла существует
  fs.stat(data.path, (errorExist) => {

    if (errorExist) {
      event.sender.webContents.send('project-save:error', {
        file: data.file,
        path: data.path,
        fileName: path.basename(data.path, '.lumly'),
        type: 'save:not-exists'
      });
      return;
    }

    // путь существует => сохраняем файл
    fs.writeFile(data.path, data.file, (errorWrite) => {
      if (errorWrite) {
        event.sender.webContents.send('project-save:error', {
          type: 'save:general'
        });
        return;
      };

      event.sender.webContents.send('project-saved');
    });
  });

});

// Сохраняем файл как
ipcMain.on('project-save-as', (event, data) => {

  let filleName = data.fileName || 'project';

  if (data.path) {
    filleName = path.basename(data.path, '.lumly');
  }

  dialog.showSaveDialog({
    title: 'Save project',
    defaultPath: `${app.getPath('downloads')}/${filleName}.lumly`,
    filters: [
      { name: '', extensions: ['lumly'] }
    ]
  }, (filePath) => {
    if (filePath === undefined) {
      return;
    }

    // save file
    fs.writeFile(filePath, data.file, (error) => {
      if (error) {
        event.sender.webContents.send('project-save:error', {
          type: 'save:general'
        });
        return;
      };

      event.sender.webContents.send('project-saved', {
        path: filePath
      });
    });

  });
});

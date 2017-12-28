import { Menu, MenuItem, app, BrowserWindow, ipcMain, shell, dialog, screen } from 'electron';
import * as log from 'electron-log';
import './electron/events';
import { setTopMenu, contextMenu, fileContextMenu } from './electron/menu';
import { recents } from './electron/store';
import { getWindowBounds } from './electron/utils';

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
  recentFiles: recents.get(),
  platform: process.platform
}

// Функция для создания окна приложения
function createWindow(data?) {

  const bounds = getWindowBounds();

  let win = new BrowserWindow({
    title: 'Lumly',
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

  setTopMenu();
}

// Как только приложение закончило загружаться, подписываемся на открыть событие открыть файл
app.on('will-finish-launching', () => {
  app.on('open-file', (event, path) => {
    event.preventDefault();
    if (windows.length) {
      createWindow({path});
    } else {
      openedFromPath = path;
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

recents.onUpdate((files) => {
  dataForWindow.recentFiles = files;

  this.windows.forEach(window => {
    if (window.isDestroyed()) {
      return;
    }

    // window.webContents.send('Recent:Update', files);
  });
});

ipcMain.on('show-context-menu', function (event, params) {
  const win = BrowserWindow.fromWebContents(event.sender);
  contextMenu.popup(win);
});

ipcMain.on('File:Context-Menu:Open', function (event, params) {
  const win = BrowserWindow.fromWebContents(event.sender);
  fileContextMenu.popup(win, {
    x: params.x,
    y: params.y
  });
});

ipcMain.on('Open:New:Project:FromData', function(event, projectData) {
  createWindow({projectData});
});

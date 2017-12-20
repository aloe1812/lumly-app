import { Menu, MenuItem, app, BrowserWindow, ipcMain, shell, dialog, screen } from 'electron';
import { AppEvents } from './electron/events';
import { setMenu } from './electron/menu';
import * as Store from 'electron-store';

const DEFAULT_SIZES = {
  width: 1200,
  height: 700,
  minWidth: 500,
  minHeight: 300
};

const store = new Store({
  encryptionKey: 'Qpv54qjyyoZ6Ii3QZ3I6'
});

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {});
}

// Сохраняем ссылку на глобальный объект окна, в противном случае окно будет закрыто
// автоматически, когда сборщик мусора удалит объект
let mainWindow;
const appEvents = new AppEvents();

// Общеее контекстное меню
const contextMenu = new Menu();

contextMenu.append(new MenuItem({ role: 'cut' }));
contextMenu.append(new MenuItem({ role: 'copy' }));
contextMenu.append(new MenuItem({ role: 'paste' }));

// контекстное меню файла
const fileContextMenu = new Menu();

fileContextMenu.append(new MenuItem({
  label: 'Rename',
  click: function(menuItem, win) {
    win.webContents.send('File:Context-Menu:Clicked', 'rename');
  }
}));
fileContextMenu.append(new MenuItem({
  label: 'Delete',
  click: function(menuItem, win) {
    win.webContents.send('File:Context-Menu:Clicked', 'delete');
  }
}));

// Функция для создания окна приложения
function createWindow() {
  // Create the browser window.

  const bounds = getMainWindowBounds();

  mainWindow = new BrowserWindow({
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

  appEvents.setDependencies({
    window: mainWindow,
    store: store
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools
  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  setMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Показывает контекстное меню
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

ipcMain.on('File:Context-Menu:Open', function (event, params) {
  const win = BrowserWindow.fromWebContents(event.sender);
  fileContextMenu.popup(win, {
    x: params.x,
    y: params.y
  });
});

// Helpers
function getMainWindowBounds() {
  const displayWorkArea = screen.getPrimaryDisplay().workArea;

  const width = DEFAULT_SIZES.width > displayWorkArea.width ? displayWorkArea.width : DEFAULT_SIZES.width;
  const height = DEFAULT_SIZES.height > displayWorkArea.height ? displayWorkArea.height : DEFAULT_SIZES.height;

  const x = displayWorkArea.x + ((displayWorkArea.width - width) / 2);
  const y = displayWorkArea.y + ((displayWorkArea.height - height) / 2);

  return {
    width,
    height,
    x,
    y,
    minWidth: DEFAULT_SIZES.minWidth,
    minHeight: DEFAULT_SIZES.minHeight
  };
}

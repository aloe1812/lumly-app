import { Menu, MenuItem, app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { AppEvents } from './electron/events'

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {});
}

// Сохраняем ссылку на глобальный объект окна, в противном случае окно будет закрыто
// автоматически, когда сборщик мусора удалит объект
let mainWindow;
const appEvents = new AppEvents();

const contextMenu = new Menu();

contextMenu.append(new MenuItem({ role: 'cut' }));
contextMenu.append(new MenuItem({ role: 'copy' }));
contextMenu.append(new MenuItem({ role: 'paste' }));

// Функция для создания окна приложения
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Lumly',
    webPreferences: {
      nodeIntegration: true
    }
  });

  appEvents.setWindow(mainWindow);

  mainWindow.setMinimumSize(500, 300);

  mainWindow.setSize(1200, 700);

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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
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

ipcMain.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender);
  contextMenu.popup(win);
});

// Before Quit events
app.on('window-all-closed', () => {
  app.quit();
});

app.on('before-quit', () => {
  mainWindow.webContents.send('App:Before-Quit');
});

import { app, Menu, shell, MenuItem, ipcMain, BrowserWindow } from 'electron';
import * as path from 'path';
import * as EventEmitter from 'events';
import { recents } from './store';

export const topMenuEvents = new EventEmitter();

/***********************************************
* ============ Верхнее меню ============= *
***********************************************/
const topMenuTemplate: any = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        click () {
          topMenuEvents.emit(
            'new-project'
          );
        }
      },
      {
        label: 'New File'
      },
      {
        label: 'New Folder'
      },
      {
        type: 'separator'
      },
      {
        label: 'Open',
        click (item, focusedWindow) {
          topMenuEvents.emit(
            'open-project',
            {
              window: focusedWindow,
              origin: 'menu'
            }
          );
        }
      },
      {
        label: 'Open Recent',
        submenu: getRecentsSubmenu()
      },
      {
        type: 'separator'
      },
      {
        label: 'Close'
      },
      {
        label: 'Save',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('trigger-project-save');
          }
        },
        accelerator: 'CmdOrCtrl+S'
      },
      {
        label: 'Save As',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('trigger-project-save-as');
          }
        },
        accelerator: 'Shift+CmdOrCtrl+S'
      },
      {
        type: 'separator'
      },
      {
        label: process.platform === 'darwin' ? 'Show In Finder' : 'Show In Explorer'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Restore default layout',
        click (item, focusedWindow) {
          if (focusedWindow) { focusedWindow.webContents.send('restore-default-layout'); }
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        type: 'separator'
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) { focusedWindow.reload(); }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) { focusedWindow.webContents.toggleDevTools(); }
        }
      },
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { shell.openExternal('http://dudes.team') }
      }
    ]
  }
]

if (process.platform === 'darwin') {

  const name = app.getName();

  topMenuTemplate.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Window menu.
  topMenuTemplate[4].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

function getRecentsSubmenu() {
  const template = [];

  const recentFiles = recents.get();

  if (recentFiles && recentFiles.length) {
    try {
      recentFiles.forEach(recentFile => {
        template.push({
          label: path.basename(recentFile.path),
          click: (item, focusedWindow) => {
            topMenuEvents.emit(
              'open-project',
              {
                window: focusedWindow,
                path: recentFile.path,
                origin: 'menu-recent'
              }
            );
          }
        });
      });
    } catch (e) {
      template.push({
        label: 'No recent projects',
        enabled: false
      });
    }
  } else {
    template.push({
      label: 'No recent projects',
      enabled: false
    });
  }

  return template;
}

// обновляем меню при создании нового окна
app.on('browser-window-created', (event, window) => {
  updateTopMenu(window);
});

// обновляем меню при смене фокуса окна
app.on('browser-window-focus', (event, window) => {
  updateTopMenu(window);
});

// обновляем меню если у окна появился активный проект
ipcMain.on('set-window-project-active', () => {
  setTimeout(() => {
    updateTopMenu(BrowserWindow.getFocusedWindow());
  }, 50)
});

recents.onUpdate(() => {
  topMenuTemplate[1].submenu[5].submenu = getRecentsSubmenu();
  updateTopMenu(BrowserWindow.getFocusedWindow());
})

function updateTopMenu(focusedWindow) {
  const isProjectActive = () => {
    return (<any>focusedWindow).customWindowData && ( (<any>focusedWindow).customWindowData.projectPath || (<any>focusedWindow).customWindowData.isProjectNew );
  };

  const menuIndex = process.platform === 'darwin' ? 1 : 0;

  if ( isProjectActive() ) {
    topMenuTemplate[menuIndex].submenu[1].enabled = true;
    topMenuTemplate[menuIndex].submenu[2].enabled = true;
    topMenuTemplate[menuIndex].submenu[8].enabled = true;
    topMenuTemplate[menuIndex].submenu[9].enabled = true;
  } else {
    topMenuTemplate[menuIndex].submenu[1].enabled = false;
    topMenuTemplate[menuIndex].submenu[2].enabled = false;
    topMenuTemplate[menuIndex].submenu[8].enabled = false;
    topMenuTemplate[menuIndex].submenu[9].enabled = false;
  }

  const topMenu = Menu.buildFromTemplate(topMenuTemplate);
  Menu.setApplicationMenu(topMenu);
}

/***********************************************
* ============  Контекстные меню ============= *
***********************************************/

// Общеее контекстное меню
export const contextMenu = new Menu();

contextMenu.append(new MenuItem({ role: 'cut' }));
contextMenu.append(new MenuItem({ role: 'copy' }));
contextMenu.append(new MenuItem({ role: 'paste' }));

// контекстное меню файла
export const fileContextMenu = new Menu();

fileContextMenu.append(new MenuItem({
  label: 'Rename',
  click: function(menuItem, win) {
    win.webContents.send('file-context-menu-selected', 'rename');
  }
}));

fileContextMenu.append(new MenuItem({
  label: 'Delete',
  click: function(menuItem, win) {
    win.webContents.send('file-context-menu-selected', 'delete');
  }
}));

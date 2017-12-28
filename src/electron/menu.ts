import { app, Menu, shell, MenuItem } from 'electron';
import { openNewProject } from './events';

/***********************************************
* ============ Верхнее меню ============= *
***********************************************/
let isTopMenuCreated = false;

const topMenuTemplate: any = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project'
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
          if (focusedWindow) {
            openNewProject({
              sender: focusedWindow
            });
          }
        }
      },
      {
        label: 'Open Recent'
      },
      {
        type: 'separator'
      },
      {
        label: 'Close'
      },
      {
        label: 'Save'
      },
      {
        label: 'Save As'
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
          if (focusedWindow) { focusedWindow.webContents.send('Restore:Default-Layout'); }
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

export function setTopMenu() {
  if (isTopMenuCreated) {
    return;
  }

  const topMenu = Menu.buildFromTemplate(topMenuTemplate);
  Menu.setApplicationMenu(topMenu);
  isTopMenuCreated = true;
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
    win.webContents.send('File:Context-Menu:Clicked', 'rename');
  }
}));

fileContextMenu.append(new MenuItem({
  label: 'Delete',
  click: function(menuItem, win) {
    win.webContents.send('File:Context-Menu:Clicked', 'delete');
  }
}));

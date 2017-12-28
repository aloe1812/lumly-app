import { BrowserWindow, ipcMain, dialog, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { store } from './store';

// Открываем проект через меню
ipcMain.on('Open:Project', (event, data) => {

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

    const filePath = filePaths[0];

    if (path.extname(filePath) !== '.lumly') {
      event.sender.webContents.send('Project:Opened:Error:Extenstion');
      return;
    }

    fs.readFile(filePath, 'utf8', (err, contents) => {
      if (err) {
        event.sender.webContents.send('Project:Opened:Error');
        return;
      }

      event.sender.webContents.send('Project:Opened', {
        file: contents,
        path: filePath
      });
    });
  });

});

// Открываем недавний проект по пути файла
ipcMain.on('Open:Project:Recent', (event, project) => {
  if (path.extname(project.path) !== '.lumly') {
    event.sender.webContents.send('Project:Opened:Error:Extenstion');
    return;
  }

  fs.readFile(project.path, 'utf8', (err, contents) => {
    if (err) {
      event.sender.webContents.send('Project:Recent:Opened:Error', project);
      return;
    }

    event.sender.webContents.send('Project:Opened', {
      file: contents,
      path: project.path
    });
  });
});

// Сохраняем проект
ipcMain.on('Project:Save', (event, data) => {

  // проверяем что пусть существует
  fs.stat(data.path, (errorExist) => {

    if (errorExist) {
      event.sender.webContents.send('Project:Saved:Error:Exist', {
        file: data.file,
        path: data.path,
        fileName: path.basename(data.path, '.lumly')
      });
      return;
    }

    fs.writeFile(data.path, data.file, (errorWrite) => {
      if (errorWrite) {
        event.sender.webContents.send('Project:Saved:Error');
        return;
      };

      event.sender.webContents.send('Project:Saved');
    });
  });

});

// Сохраняем файл как
ipcMain.on('Project:SaveAs', (event, data) => {
  dialog.showSaveDialog({
    title: 'Save project',
    defaultPath: `${app.getPath('downloads')}/${ data.fileName || 'project' }.lumly`,
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
        event.sender.webContents.send('Project:Saved:Error');
        return;
      };
      event.sender.webContents.send('Project:Saved', filePath);
    });
  });
});

// Сохраняем недавние проекты
ipcMain.on('Save:Recent', (event, recent) => {
  for (let i = 0; i < recent.length; i++) {
    if (!recent[i].title) {
      recent[i].title = path.basename(recent[i].path)
    }
  }

  store.set('recentFiles', recent);

  event.returnValue = true;
});

ipcMain.on('Init:Project:Open:FromFile', (event, filePath) => {
  if (path.extname(filePath) !== '.lumly') {
    event.sender.webContents.send('Init:Project:Opened:FromFile:Error:Ext');
    return;
  }

  fs.readFile(filePath, 'utf8', (err, contents) => {
    if (err) {
      event.sender.webContents.send('Init:Project:Opened:FromFile:Error');
      return;
    }

    event.sender.webContents.send('Init:Project:Opened:FromFile', {
      file: contents,
      path: filePath
    });
  });
});

export function openNewProject(event) {
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

    const filePath = filePaths[0];

    if (path.extname(filePath) !== '.lumly') {
      event.sender.webContents.send('Project:Opened:Error:Extenstion');
      return;
    }

    fs.readFile(filePath, 'utf8', (err, contents) => {
      if (err) {
        event.sender.webContents.send('Project:Opened:Error');
        return;
      }

      event.sender.webContents.send('Project:New:Opened', {
        file: contents,
        path: filePath
      });
    });
  });

}

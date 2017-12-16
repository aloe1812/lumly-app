import { ipcMain, dialog, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export class AppEvents {

  win;

  constructor(window?) {
    if (window) {
      this.win = window;
    }
    this.registerOpenProjectEvent();
    this.registerSaveProjectEvent();
  }

  setWindow(window) {
    this.win = window;
  }

  private registerOpenProjectEvent() {
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
          this.win.webContents.send('Project:Opened:Error:Extenstion');
          return;
        }

        fs.readFile(filePaths[0], 'utf8', (err, contents) => {
          if (err) {
            return;
          }

          this.win.webContents.send('Project:Opened', {
            file: contents,
            path: filePath
          });
        });
      });

    });
  }

  // TODO: добавить лог
  private registerSaveProjectEvent() {
    ipcMain.on('Project:Save', (event, data) => {

      // проверяем что пусть существует
      fs.stat(data.path, (errorExist) => {

        if (errorExist) {
          this.win.webContents.send('Project:Saved:Error:Exist', {
            file: data.file,
            path: data.path,
            fileName: path.basename(data.path, '.lumly')
          });
          return;
        }

        fs.writeFile(data.path, data.file, (errorWrite) => {
          if (errorWrite) {
            this.win.webContents.send('Project:Saved:Error');
            return;
          };

          this.win.webContents.send('Project:Saved');
        });
      })

    });

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
            this.win.webContents.send('Project:Saved:Error');
            return;
          };
          this.win.webContents.send('Project:Saved', filePath);
        });
      });
    });
  }

}

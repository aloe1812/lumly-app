import { ipcMain, dialog, app } from 'electron';
import * as fs from 'fs';

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
        const ext = this.getFileExtensionByPath(filePath);

        if (ext !== 'lumly') {
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

  // TODO: 1. добавить лог, 2. оно создаст файл, если в текущем его нету
  // 3. проверить, если нету папки?
  // 4. может вообще проверять существует путь и если нету, то показывать сохранить как
  private registerSaveProjectEvent() {
    ipcMain.on('Project:Save', (event, data) => {
      fs.writeFile(data.path, data.file, (error) => {
        if (error) {
          this.win.webContents.send('Project:Saved:Error');
          throw error;
        };

        this.win.webContents.send('Project:Saved');
      });
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
            throw error;
          };
          this.win.webContents.send('Project:Saved', filePath);
        });
      });
    });
  }

  private getFileExtensionByPath(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

}

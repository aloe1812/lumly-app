import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';

export class AppEvents {

  win;

  constructor(window?) {
    if (window) {
      this.win = window;
    }
    this.registerOpenProjectEvent();
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

          this.win.webContents.send('Project:Opened', contents);
        });
      });

    });
  }

  private getFileExtensionByPath(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

}

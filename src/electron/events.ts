import { ipcMain, dialog, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export class AppEvents {

  win;
  store;
  isDataSaved = false;

  constructor(data?) {
    if (data) {
      this.setDependencies(data);
    }
    this.registerOpenProjectEvent();
    this.registerSaveProjectEvent();
    this.registerStoreEvents();
  }

  setDependencies(data) {
    this.win = data.window;
    this.store = data.store;

    this.win.on('close', (event) => {
      if (!this.isDataSaved) {
        event.preventDefault();
        this.win.webContents.send('App:Before-Quit');
      }
    });
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

        fs.readFile(filePath, 'utf8', (err, contents) => {
          if (err) {
            this.win.webContents.send('Project:Opened:Error');
            return;
          }

          this.win.webContents.send('Project:Opened', {
            file: contents,
            path: filePath
          });
        });
      });

    });

    ipcMain.on('Open:Project:Recent', (event, project) => {
      if (path.extname(project.path) !== '.lumly') {
        this.win.webContents.send('Project:Opened:Error:Extenstion');
        return;
      }

      fs.readFile(project.path, 'utf8', (err, contents) => {
        if (err) {
          this.win.webContents.send('Project:Recent:Opened:Error', project);
          return;
        }

        this.win.webContents.send('Project:Opened', {
          file: contents,
          path: project.path
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

  private registerStoreEvents() {
    ipcMain.on('Store:Get:Recent', () => {
      const data = this.store.get('recent', null);
      this.win.webContents.send('Store:Got:Recent', data);
    });

    ipcMain.on('Store:Save:Recent', (ev, recent) => {
      for (let i = 0; i < recent.length; i++) {
        if (!recent[i].title) {
          recent[i].title = path.basename(recent[i].path)
        }
      }

      this.store.set('recent', recent);
      this.isDataSaved = true;

      app.quit();
    });
  }

}

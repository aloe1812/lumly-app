import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../core/electron.service';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;

  constructor(
    private electronService: ElectronService,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.electronService.ipcRenderer.on('Project:Opened', (event, data) => {
      try {
        this.project = JSON.parse(data);
        console.log(this.project);
        this.store.data('Project:Active').set(this.project);
      } catch (e) {
        alert('Provided file is incorrect or damaged');
      }
    });

    this.electronService.ipcRenderer.on('Project:Opened:Error:Extenstion', (event, data) => {
      alert(`File extension is incorrect. Must be 'lumly'`);
    });
  }

  openProject() {
    this.electronService.ipcRenderer.send('Open:Project');
  }

}

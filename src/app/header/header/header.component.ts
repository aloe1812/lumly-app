import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../core/electron.service';
import { StoreService } from '../../core/store.service';
import { ProjectService } from '../../core/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  project;
  isProjectHasChanges = false;
  openProjectTitle = 'Open Project';

  constructor(
    private electronService: ElectronService,
    private store: StoreService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.subscribeToElectronEvents();

    this.projectService.onProjectHasChanges.subscribe(hasChanges => {
      this.isProjectHasChanges = hasChanges;
    });
  }

  openProject() {
    this.electronService.ipcRenderer.send('Open:Project');
  }

  saveProject() {
    const projectData = this.projectService.getProjectDataForSave();

    this.electronService.ipcRenderer.send('Project:Save', {
      path: this.project.project.path,
      file: JSON.stringify(projectData)
    });
  }

  private subscribeToElectronEvents() {
    this.electronService.ipcRenderer.on('Project:Opened', (event, data) => {
      try {
        this.project = JSON.parse(data.file);
        this.project.project.path = data.path;
        this.projectService.prepareProject(this.project);
        this.store.data('Project:Active').set(this.project);
        this.openProjectTitle = this.project.project.title;
      } catch (e) {
        alert('Provided file is incorrect or damaged');
      }
    });

    this.electronService.ipcRenderer.on('Project:Opened:Error:Extenstion', (event, data) => {
      alert(`File extension is incorrect. Must be 'lumly'`);
    });

    this.electronService.ipcRenderer.on('Project:Saved', () => {
      this.projectService.updateProjectAfterSave();
    });

    this.electronService.ipcRenderer.on('Project:Saved:Error', () => {
      alert('There was error on saving file');
    });
  }

}

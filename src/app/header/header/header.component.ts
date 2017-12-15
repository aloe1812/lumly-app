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
    this.subscribeToProjectChanges();
    this.subscribeToActiveProject();
  }

  openProject() {
    this.electronService.ipcRenderer.send('Open:Project');
  }

  saveProject() {
    const projectData = this.projectService.getProjectDataForSave();

    if (this.project.project.path) {
      this.electronService.ipcRenderer.send('Project:Save', {
        path: this.project.project.path,
        file: JSON.stringify(projectData)
      });
    } else {
      this.electronService.ipcRenderer.send('Project:SaveAs', {
        file: JSON.stringify(projectData),
        fileName: projectData.project.title
      });
    }
  }

  private subscribeToElectronEvents() {
    this.electronService.ipcRenderer.on('Project:Opened', (event, data) => {
      try {
        this.project = this.projectService.parseProjectFile(data.file)

        this.project.project.path = data.path;

        this.projectService.prepareProject(this.project);
        this.projectService.storeProject(this.project);
        this.projectService.setActive(this.project);
      } catch (e) {
        alert('Provided file is incorrect or damaged');
      }
    });

    this.electronService.ipcRenderer.on('Project:Opened:Error:Extenstion', (event, data) => {
      alert(`File extension is incorrect. Must be 'lumly'`);
    });

    this.electronService.ipcRenderer.on('Project:Saved', (event, path) => {
      if (path) {
        this.project.project.path = path;
      }
      this.projectService.updateProjectAfterSave();
    });

    this.electronService.ipcRenderer.on('Project:Saved:Error', () => {
      alert('There was an error on saving file');
    });
  }

  private subscribeToProjectChanges() {
    this.store.data('Project:Active:HasChanges').get().subscribe(hasChanges => {
      this.isProjectHasChanges = hasChanges;
    });
  }

  private subscribeToActiveProject() {
    this.store.data('Project:Active').get().subscribe(
      (project) => {
        this.project = project;
        this.openProjectTitle = project ? project.project.title : 'Open Project';
      }
    )
  }

}

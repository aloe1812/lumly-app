import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { ProjectService } from 'app/core/project.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit, OnChanges, OnDestroy {

  @Input() hasChanges: boolean;

  statusText = '';
  timerId;

  private sub: Subscription;

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.sub = this.projectService.onProjectSaved.subscribe(() => {
      this.setStatus(true);
    });
  }

  ngOnChanges(changes) {
    this.setStatus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private setStatus(isSaved = false) {
    // если сообщение о сохранении еще висит (при этом это не новое сообщение о сохраненении)
    if (!isSaved && this.timerId) {
      return;
    }

    if (isSaved) {
      this.statusText = 'Saved!';

      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.timerId = null;
        this.setStatusText();
      }, 1500);
    } else {
      this.setStatusText();
    }
  }

  private setStatusText() {
    if (this.hasChanges) {
      this.statusText = 'Unsaved changes';
    } else {
      this.statusText = '';
    }
  }

}

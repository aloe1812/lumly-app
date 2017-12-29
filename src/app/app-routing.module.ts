import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { StartScreenComponent } from 'app/screens/start-screen/start-screen.component';
import { MainScreenComponent } from 'app/screens/main-screen/main-screen.component';
import { ProjectService } from 'app/core/project.service';

const appRoutes: Routes = [
  {
    path: 'start',
    component: StartScreenComponent
  },
  {
    path: 'main',
    component: MainScreenComponent
  },
  {
    path: '**', redirectTo: 'start'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true,
        initialNavigation: false
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {

    projectService.onProjectOpen.subscribe(data => {

      if (!data) {
        this.router.navigateByUrl('/start');
        return;
      }

      if (data.pending) {
        return;
      }

      if (data.tryOpen) {

        if (data.success) {
          this.router.navigateByUrl('/main');
        } else {

          if (data.fromFile) {
            this.router.navigateByUrl('/start');
            setTimeout(() => { alert(data.error); }, 100);
          } else {
            alert(data.error);
          }

        }

      } else if (data.created) {
        this.router.navigateByUrl('/main');
      } else {
        this.router.navigateByUrl('/start');
      }

    })
  }
}

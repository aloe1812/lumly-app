import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { StartScreenComponent } from 'app/screens/start-screen/start-screen.component';
import { MainScreenComponent } from 'app/screens/main-screen/main-screen.component';

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
  constructor(router: Router) {
    router.navigateByUrl('/start');
  }
}

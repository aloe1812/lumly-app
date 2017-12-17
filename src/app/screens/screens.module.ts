import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from 'app/header/header.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';
import { EditorModule } from 'app/editor/editor.module';
import { DiagramModule } from 'app/diagram/diagram.module';
import { SidenavModule } from 'app/sidenav/sidenav.module';
import { SvgIconModule } from 'app/svg-icon/svg-icon.module';

import { MainScreenComponent } from 'app/screens/main-screen/main-screen.component';
import { StartScreenComponent } from 'app/screens/start-screen/start-screen.component';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SidebarModule,
    EditorModule,
    DiagramModule,
    SidenavModule,
    SvgIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainScreenComponent,
    StartScreenComponent
  ]
})
export class ScreensModule { }

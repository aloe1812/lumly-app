import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from 'app/app-routing.module';
import { CoreModule } from './core/core.module';
import { ScreensModule } from 'app/screens/screens.module';
import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { EditorModule } from './editor/editor.module';
import { DiagramModule } from './diagram/diagram.module';
import { SidenavModule } from './sidenav/sidenav.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ScreensModule,
    HeaderModule,
    SidebarModule,
    EditorModule,
    DiagramModule,
    SidenavModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

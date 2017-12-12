import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { HeaderModule } from 'app/header/header.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';
import { EditorModule } from 'app/editor/editor.module';
import { DiagramModule } from 'app/diagram/diagram.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HeaderModule,
    SidebarModule,
    EditorModule,
    DiagramModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

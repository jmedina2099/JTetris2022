import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VentanaPrincipalComponent } from './ventana-principal/ventana-principal.component';
import { PanelTetrisComponent } from './panel-tetris/panel-tetris.component';
import { BoxComponent } from './box/box.component';
import { PanelLateralComponent } from './panel-lateral/panel-lateral.component';
import { ScoreComponent } from './score/score.component';

@NgModule({
  declarations: [
    AppComponent,
    VentanaPrincipalComponent,
    PanelTetrisComponent,
    BoxComponent,
    PanelLateralComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

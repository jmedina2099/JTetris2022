import { Component, Input } from '@angular/core';
import { Board } from '../app.component';
import { initialBoard } from '../ventana-principal/ventana-principal.component';

@Component({
  selector: 'div.panel-lateral',
  templateUrl: './panel-lateral.component.html',
  styleUrls: ['./panel-lateral.component.css']
})
export class PanelLateralComponent {

  @Input() board : Board = initialBoard;

}

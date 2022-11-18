import { Component, Output, EventEmitter, Input } from '@angular/core';
import axios from 'axios';
import { ApiService } from '../api-service.service';
import { Board, Caja, Figura } from '../app.component';

import SERVERNAME from '../servername.json'

import { initialBoard } from '../ventana-principal/ventana-principal.component';

@Component({
  selector: 'div.panel-tetris',
  templateUrl: './panel-tetris.component.html',
  styleUrls: ['./panel-tetris.component.css']
})
export class PanelTetrisComponent {

  @Input() fallingFigure : Figura | undefined;
  @Input() figuresFixed : Caja[] = [];
  @Input() board : Board = initialBoard;
  @Input() setBoard : Function = () => {};
  @Input() setIntervalId : Function = () => {};
  @Input() timer : NodeJS.Timer[] = [];

  apiService: ApiService;

  constructor( apiService : ApiService ) {
    this.apiService = apiService;
  }

  ngOnInit() {
    this.apiService.fetchBoard(this.board,this.setBoard,this.timer);
  }

}

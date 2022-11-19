import { Component, Output, EventEmitter, Input } from '@angular/core';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';

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
  socket: Socket | undefined;

  constructor( apiService : ApiService ) {
    this.apiService = apiService;
  }

  ngOnInit() {
    this.apiService.fetchBoard(this.board,this.setBoard,this.timer);

    const boardListener = (boardCad: string) => {
      //console.log('board from rabbitmq = ' + boardCad );
      if( this.board.running && !this.board.paused ) {
        const boardObj = JSON.parse(boardCad);
        this.setBoard( boardObj );
      }
    };

    this.socket = io( SERVERNAME.node_rabbitmq_address ,{
      reconnection: true
    });

    this.socket.on('board', boardListener);
    this.socket.on('connect_error', err =>  {});
    this.socket.on('connect_failed', err => {});
    this.socket.on('disconnect', err => {});
  }

  ngOnDestroy() {
    if ( this.socket ) this.socket.close();
  }
}

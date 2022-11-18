import { Component } from '@angular/core';

@Component({
  selector: 'div.app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tetris-angular';
}

export interface Board {
  running: boolean
  paused: boolean
  gameOver: boolean
  hash: number
  figuresFixed: Caja[]
  fallingFigure: Figura | undefined
  score: number
}

export interface Caja {
  x: number
  y: number
  color: string
}

export interface Figura {
  listBoxes: Caja[]
  hashBoard: number
}
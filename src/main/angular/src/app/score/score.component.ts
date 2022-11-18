import { Component, Input } from '@angular/core';
import { Board } from '../app.component';
import { initialBoard } from '../ventana-principal/ventana-principal.component';

@Component({
  selector: 'div.score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent {

  @Input() board : Board = initialBoard;

}

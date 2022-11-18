import { Component, HostListener } from '@angular/core';
import { ApiService } from '../api-service.service';
import { Board } from '../app.component';

export const initialBoard : Board = {
  running:false, paused:false, gameOver:false, fallingFigure:undefined, figuresFixed:[], score:0, hash:0
};

@Component({
  selector: 'div.ventana-principal',
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})
export class VentanaPrincipalComponent {

  board : Board = initialBoard;
  timer : NodeJS.Timer[] = [];

  private apiService : ApiService;

  constructor( apiService : ApiService ) {
    this.apiService = apiService;
    this.setRunning = this.setRunning.bind(this);
    this.getRunning = this.getRunning.bind(this);
    this.setBoard = this.setBoard.bind(this);
    this.setPaused = this.setPaused.bind(this);
  }

  setRunning( running : boolean ) {
    this.board.running = running;
  }

  setPaused( paused : boolean ) {
    this.board.paused = paused;
  }

  getRunning() {
    return this.board.running;
  }

  setBoard( board : Board ) {
    this.board = board;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    switch (event.code) {
      case "Enter":
        if( !this.getRunning() ) {
          this.apiService.start( this.board, this.setBoard, this.setRunning, this.timer );
        } else {
          this.apiService.pause( this.board, this.setBoard, this.setPaused, this.timer );
        }
        break;
      case "Space":
        this.apiService.space( this.board );
        break;
      case "ArrowLeft":
        this.apiService.left( this.board );
        break;
      case "ArrowRight":
        this.apiService.right( this.board );
        break;
      case "ArrowUp":
        this.apiService.up( this.board );
        break
      case "ArrowDown":
        this.apiService.down( this.board );
        break
    }
  }

  ngOnInit() {
  }
}

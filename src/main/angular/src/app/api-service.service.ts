import { Injectable } from '@angular/core';
import axios from 'axios';
import { Board, Figura } from './app.component';

import SERVERNAME from './servername.json'


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  timeoutFetch : number = 1000;

  constructor() { }

  fetchBoard( board : Board, setBoard : Function, timer : NodeJS.Timer[] ) {
    this.getBoard(board,setBoard,timer);
    timer[0] = setInterval(() => this.getBoard(board,setBoard,timer), this.timeoutFetch);
  }

  getBoard( board : Board, setBoard : Function , timer : NodeJS.Timer[] ) {
    axios
    .get<Board>( SERVERNAME.backend_address+"/board" )
    .then( response => {
      if( response && response.data ) {
        this.setBoardFunc(board,response.data,setBoard,timer);
      } else {
        if( timer[0] ) clearInterval(timer[0]);
        board.figuresFixed = [];
        board.fallingFigure = undefined;
        board.hash =  0;
      }
    })
    .catch( (error) => {
      if( timer[0] ) clearInterval(timer[0]);
    });
  }

  setBoardFunc( board : Board, newBoard: Board, setBoard : Function,  timer : NodeJS.Timer[] ) {
    if( newBoard.running && !newBoard.paused ) {
      setBoard( newBoard );
    } else {
      if( timer[0] ) clearInterval(timer[0]);
      newBoard.figuresFixed = [];
      newBoard.fallingFigure = undefined;
      newBoard.hash = 0;
      setBoard( newBoard );
    }
  }


  start( board : Board, setBoard : Function , setRunning : Function, timer : NodeJS.Timer[] ) {
    axios
    .get<boolean>( SERVERNAME.backend_address+"/start" )
    .then( response => {
      if( response && typeof response.data === "boolean" ) {
        if( board.running !== response.data ) {
          board.running = response.data;
          setRunning( board.running );
          if( board.running ) {
            this.fetchBoard(board,setBoard,timer);            
          }
        }
      } else {
        board.running = false;
        board.paused = false;
      }
    })
    .catch( (error) => {
      board.running = false;
      board.paused = false;      
    });
  }

  pause( board : Board, setBoard : Function, setPaused : Function, timer : NodeJS.Timer[] ) {
    axios
    .get<boolean>( SERVERNAME.backend_address+"/pause" )
    .then( response => {
      if( response && typeof response.data === "boolean" ) {
        if( board.paused !== response.data ) {
          board.paused = response.data;
          setPaused( board.paused );
          if( board.running && !board.paused ) {
            this.fetchBoard(board,setBoard,timer);            
          } else {
            if( timer[0] ) clearInterval(timer[0]);
            board.figuresFixed = [];
            board.fallingFigure = undefined;
            board.hash = 0;            
          }
        }
      }
    })
    .catch( (error) => {
      board.running = false;
      board.paused = false;
    });
  }

  doMovement( board : Board, url: string ) {
    axios
    .get<Figura>( SERVERNAME.backend_address+url )
    .then( response => {
      if( response && response.data && Array.isArray(response.data.listBoxes) ) {
        // Pinta solamente si el hash del board coincide con el hash de la figura.
        if( board.hash === response.data.hashBoard ) {
          board.fallingFigure = response.data;
        }
      }
    })
    .catch( (error) => {
      board.fallingFigure = undefined;
    });
  }  

  space( board : Board ) {
    this.doMovement( board, "/space" );
  }

  left( board : Board ) {
    this.doMovement( board, "/left" );
  }
  
  right( board : Board ) {
    this.doMovement( board, "/right" );
  }

  up( board : Board ) {
    this.doMovement( board, "/up" );
  }

  down( board : Board ) {
    this.doMovement( board, "/down" );
  }

}

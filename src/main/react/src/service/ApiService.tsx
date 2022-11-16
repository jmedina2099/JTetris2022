import axios from 'axios';
import { Board, Game } from '../App';
import { Figura } from '../components/Figure/Figure';

import SERVERNAME from '../servername.json'

export class ApiService {
  
  timeoutFetch : number = 1000;

  fetchBoard( context : Game ) {
    const idInterval : NodeJS.Timer[] = [];
    this.getBoard(context,idInterval);
    idInterval[0] = setInterval(() => this.getBoard(context,idInterval), this.timeoutFetch);
    context.intervalFetch[1]( idInterval[0] );
  }

  getBoard( context : Game, idInterval : NodeJS.Timer[] ) {
    const [board,setBoard] = context.board;
    axios
    .get<Board>( SERVERNAME.backend_address+"/board" )
    .then( response => {
      if( response && response.data ) {
        this.setBoardFunc(context,response.data,idInterval);
      } else {
        if( idInterval[0] ) clearInterval(idInterval[0]);
        setBoard( {...board, figuresFixed:[], fallingFigure:undefined, hash:0} );
      }
    })
    .catch( (error) => {
      if( idInterval[0] ) clearInterval(idInterval[0]);
    });
  }

  setBoardFunc(context : Game, newBoard: Board, idInterval : NodeJS.Timer[]) {
    const [board,setBoard] = context.board;
    if( board.running && !board.paused ) {
      setBoard({...board,...newBoard});
    } else {
      if( idInterval[0] ) clearInterval(idInterval[0]);
      setBoard( {...board, ...newBoard, figuresFixed:[], fallingFigure:undefined, hash:0 } );
    }
  }

  start( context : Game ) {
    const [board,setBoard] = context.board;
    axios
    .get<boolean>( SERVERNAME.backend_address+"/start" )
    .then( response => {
      if( response && typeof response.data === "boolean" ) {
        if( board.running !== response.data ) {
          setBoard( {...board, running: response.data } );
        }
      } else {
        setBoard( {...board, running: false, paused: false } );
      }
    })
    .catch( (error) => {
      setBoard( {...board, running: false, paused: false } );
    });
  }

  pause( context : Game ) {
    const [board,setBoard] = context.board;
    axios
    .get<boolean>( SERVERNAME.backend_address+"/pause" )
    .then( response => {
      if( response && typeof response.data === "boolean" ) {
        if( board.paused !== response.data ) {
          setBoard( {...board, paused: response.data} );
        }
      }
    })
    .catch( (error) => {
      setBoard( {...board, running: false, paused: false } );
    });
  }

  doMovement( context : Game, url: string ) {
    const [board,setBoard] = context.board;
    axios
    .get<Figura>( SERVERNAME.backend_address+url )
    .then( response => {
      if( response && response.data && Array.isArray(response.data.listBoxes) ) {
        // Pinta solamente si el hash del board coincide con el hash de la figura.
        if( board.hash === response.data.hashBoard ) {
          setBoard( {...board, fallingFigure: response.data} );
        }
      }
    })
    .catch( (error) => {
      setBoard( {...board, fallingFigure: undefined} );
    });
  }

  space( context : Game ) {
    this.doMovement( context, "/space" );
  }

  left( context : Game ) {
    this.doMovement( context, "/left" );
  }
  
  right( context : Game ) {
    this.doMovement( context, "/right" );
  }

  up( context : Game ) {
    this.doMovement( context, "/up" );
  }

  down( context : Game ) {
    this.doMovement( context, "/down" );
  }

}

export default ApiService;
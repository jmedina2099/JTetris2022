import SERVERNAME from '../servername.json'

import axios from 'axios';
import { Board, Game } from '../App';
import { Figura } from '../components/Figure/Figure';

export class ApiService {

    getInterval : Function = () => undefined;
    timeoutFetch : number = 1000;

    fetchBoard( context : Game ) {
      const idInterval : NodeJS.Timer[] = [];
      this.getBoard(context,idInterval);
      idInterval[0] = setInterval(() => this.getBoard(context,idInterval), this.timeoutFetch);
      context.intervalFetch[1]( idInterval[0] );
    }

    getBoard( context : Game, idInterval : NodeJS.Timer[] ) {
      const setBoxes = context.cajas[1];
      const setFigureFalling = context.figuraCayendo[1];
      axios
      .get<Board>( SERVERNAME.address+"/board" )
      .then( response => {
        if( response && response.data ) {
          this.setBoard(context,response.data,idInterval);
        } else {
          if( idInterval[0] ) clearInterval(idInterval[0]);
          setBoxes([]);
          setFigureFalling(undefined);
        }
      })
      .catch( (error) => {
        if( idInterval[0] ) clearInterval(idInterval[0]);
      });
    }

  setBoard(context : Game, board: Board, idInterval : NodeJS.Timer[]) {
    const setBoxes = context.cajas[1];
    const setFigureFalling = context.figuraCayendo[1];
    const [running,setRunning] = context.running;
    const [paused,setPaused] = context.paused;
    const [gameOver,setGameOver] = context.gameOver;
    const [hash,setHash] = context.hash;
    const score = context.score[0];
    const setScore = context.score[1];
    if( running !== board.running ) {
      setRunning( board.running );
    }
    if( paused !== board.paused ) {
      setPaused( board.paused );
    }
    if( gameOver !== board.gameOver ) {
      setGameOver( board.gameOver );
    }
    if( hash !== board.hash ) {
      setHash( board.hash );
    }
    if( board.running && !board.paused ) {
      if( board.figuresFixed && Array.isArray(board.figuresFixed) ) {
        setBoxes(board.figuresFixed);
      }
      if( board.fallingFigure && Array.isArray(board.fallingFigure.listBoxes) ) {
        setFigureFalling(board.fallingFigure);
      }
      if( score !== board.score ) {
        setScore(board.score);
      }
    } else {
      if( idInterval[0] ) clearInterval(idInterval[0]);
      setBoxes([]);
      setFigureFalling(undefined);
      setHash(0);
      if( board.paused ) {
        if( score !== board.score ) {
          setScore(board.score);
        }
      }
    }
  }

    start( setRunning : Function, setPaused : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/start" )
      .then( response => {
        if( response && typeof response.data === "boolean" ) {
          if( response.data ) {
            setRunning(response.data);
          }
        } else {
          setRunning(false);
          setPaused(false);
        }
      })
      .catch( (error) => {
        setRunning(false);
        setPaused(false);
      });
    }

    pause( setPaused : Function, setRunning : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/pause" )
      .then( response => {
        if( response && typeof response.data === "boolean" ) {
          setPaused(response.data);
        }
      })
      .catch( (error) => {
        setRunning(false);
        setPaused(false);
      });
    }

    space( setFiguraCayendo : Function, hash : number ) {
      axios
      .get<Figura>( SERVERNAME.address+"/space" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data.listBoxes) ) {
          if( hash === response.data.hashBoard ) {
            setFiguraCayendo(response.data);
          }
        }
      })
      .catch( (error) => {
        setFiguraCayendo([]);
      });
    }

    left( setFiguraCayendo : Function, hash : number ) {
      axios
      .get<Figura>( SERVERNAME.address+"/left" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data.listBoxes) ) {
          if( hash === response.data.hashBoard ) {
            setFiguraCayendo(response.data);
          }
        }
      })
      .catch( (error) => {
        setFiguraCayendo([]);
      });
    }

    right( setFiguraCayendo : Function, hash : number ) {
      axios
      .get<Figura>( SERVERNAME.address+"/right" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data.listBoxes) ) {
          if( hash === response.data.hashBoard ) {
            setFiguraCayendo(response.data);
          }
        }
      })
      .catch( (error) => {
        setFiguraCayendo([]);
      });
    }

    up( setFiguraCayendo : Function, hash : number) {
      axios
      .get<Figura>( SERVERNAME.address+"/up" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data.listBoxes) ) {
          if( hash === response.data.hashBoard ) {
            setFiguraCayendo(response.data);
          }
        }
      })
      .catch( (error) => {
        setFiguraCayendo([]);
      });
    }

    down( setFiguraCayendo : Function, hash : number) {
      axios
      .get<Figura>( SERVERNAME.address+"/down" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data.listBoxes)  ) {
          if( hash === response.data.hashBoard ) {
            setFiguraCayendo(response.data);
          }
        }
      })
      .catch( (error) => {
        setFiguraCayendo([]);
      });
    }

}

export default ApiService;
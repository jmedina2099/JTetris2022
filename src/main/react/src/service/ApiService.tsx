import SERVERNAME from '../servername.json'

import axios from 'axios';
import { Board, Game } from '../App';

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
      const setBoxesFalling = context.cajasCayendo[1];
      const running = context.running;
      const paused = context.paused;
      const gameOver = context.gameOver;
      const score = context.score[0];
      const setScore = context.score[1];
      axios
      .get<Board>( SERVERNAME.address+"/board" )
      .then( response => {
        if( response && response.data ) {
          const board = response.data;
          if( running[0] !== board.running ) {
            running[1]( board.running );
          }
          if( paused[0] !== board.paused ) {
            paused[1]( board.paused );
          }
          if( gameOver[0] !== board.gameOver ) {
            gameOver[1]( board.gameOver );
          }
          if( board.running && !board.paused ) {
            setBoxes(board.figuresFixed);
            setBoxesFalling(board.fallingFigure);
            if( score !== board.score ) {
              setScore(board.score);
            }
          } else {
            if( idInterval[0] ) clearInterval(idInterval[0]);
            setBoxes([]);
            setBoxesFalling([]);
            if( board.paused ) {
              if( score !== board.score ) {
                setScore(board.score);
              }
            }
          }
        } else {
          if( idInterval[0] ) clearInterval(idInterval[0]);
          setBoxes([]);
          setBoxesFalling([]);
        }
      })
      .catch( (error) => {
        if( idInterval[0] ) clearInterval(idInterval[0]);
      });
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

    space( setCajasCayendo : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/space" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    left( setCajasCayendo : Function ) {
      axios
      .get<boolean>( SERVERNAME.address+"/left" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    right( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/right" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    up( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/up" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

    down( setCajasCayendo : Function) {
      axios
      .get<boolean>( SERVERNAME.address+"/down" )
      .then( response => {
        if( response && response.data && Array.isArray(response.data) && response.data.length > 0 ) {
          setCajasCayendo(response.data);
        }
      })
      .catch( (error) => {
        setCajasCayendo([]);
      });
    }

}

export default ApiService;
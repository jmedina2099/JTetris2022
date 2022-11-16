import { useContext, useState, useEffect } from 'react';
import { ApiServiceContext, Game } from '../../App';
import Box from '../Box/Box';
import Figure from '../Figure/Figure';

import "./panelTetris.css";

const renderHitEnter = () => {
  return <div className="message"><div className="hitEnterLabel">HIT ENTER</div></div>;
}

const renderGameOver = () => {
  return <div className="message"><div className="gameOverLabel">GAME OVER</div></div>;
}

const renderPaused = () => {
  return <div className="message"><div className="pausedLabel">PAUSED</div></div>;
} 

const renderFigures = ( context : Game ) => {
  const [board] = context.board;
  const figuraCayendo = board.fallingFigure;
  const cajas = board.figuresFixed;
  const first = figuraCayendo? <Figure listBoxes={figuraCayendo.listBoxes} hashBoard={figuraCayendo.hashBoard}/>: <></>;
  const second = cajas.map( box => <Box key={box.x+"-"+box.y} caja={box}/> );
  return <>{first}{second}</>
}

const PanelTetris = () => {
  const context = useContext(ApiServiceContext);
  context.intervalFetch = useState<NodeJS.Timer>();
  const apiService = context.apiService;
  const socket = context.socket[0];
  const [board,setBoard] = context.board;
  useEffect(() => {
    const boardListener = (boardCad: string) => {
      console.log('board from rabbitmq = ' + boardCad );
      if( board.running && !board.paused ) {
        const boardObj = JSON.parse(boardCad);
        setBoard( boardObj );
      }
    };
    const hashListener = (hashCad: string) => {
      console.log('hash from rabbitmq = ' + hashCad );
      if( board.running && !board.paused ) {
        const hash = JSON.parse(hashCad);
        setBoard( {...board, hash: hash} );
      }
    };
    const figuresListener = (figuresCad: string) => {
      console.log('figures from rabbitmq = ' + figuresCad );
      if( board.running && !board.paused ) {
        const figures = JSON.parse(figuresCad);
        if( figures ) {
          setBoard( {...board, figuresFixed: figures} );
        }
      }
    };
    const figureFallingListener = (figureFallingCad: string) => {
      console.log('figureFalling from rabbitmq = ' + figureFallingCad );
      if( board.running && !board.paused ) {
        const figureFalling = JSON.parse(figureFallingCad);
        if( figureFalling ) {
          setBoard( {...board, fallingFigure: figureFalling} );
        }
      }
    };
    if( socket ) socket.on('board', boardListener);
    if( socket ) socket.on('hash', hashListener);
    if( socket ) socket.on('figures', figuresListener);
    if( socket ) socket.on('figure_falling', figureFallingListener);
    return () => {
      if( socket ) socket.off('board', boardListener);
      if( socket ) socket.off('hash', hashListener);
      if( socket ) socket.off('figures', figuresListener);
      if( socket ) socket.off('figure_falling', figureFallingListener);
    };
  }, [context,board,setBoard,board.running,board.paused,socket]);
  useEffect(() => {
    apiService.fetchBoard(context);
    if( !board.running || board.paused ) {
      if( context.intervalFetch[0] ) clearInterval(context.intervalFetch[0]);
    }
  }, [context,apiService,board.running,board.paused]);
  return (
    <div className="panelTetris">
      {board.running?
        (board.paused? renderPaused(): renderFigures(context)):
        (board.gameOver? renderGameOver(): renderHitEnter())}
    </div>
  );
}

export default PanelTetris;

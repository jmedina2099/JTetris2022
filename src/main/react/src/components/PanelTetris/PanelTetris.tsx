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
  useEffect(() => {
    const boardListener = (boardCad: string) => {
      //console.log('board from rabbitmq = ' + boardCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const boardObj = JSON.parse(boardCad);
        context.board[1]( boardObj );
      }
    };
    const hashListener = (hashCad: string) => {
      //console.log('hash from rabbitmq = ' + hashCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const hash = JSON.parse(hashCad);
        context.board[1]( {...context.board[0], hash: hash} );
      }
    };
    const figuresListener = (figuresCad: string) => {
      //console.log('figures from rabbitmq = ' + figuresCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const figures = JSON.parse(figuresCad);
        if( figures ) {
          context.board[1]( {...context.board[0], figuresFixed: figures} );
        }
      }
    };
    const figureFallingListener = (figureFallingCad: string) => {
      //console.log('figureFalling from rabbitmq = ' + figureFallingCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const figureFalling = JSON.parse(figureFallingCad);
        if( figureFalling ) {
          context.board[1]( {...context.board[0], fallingFigure: figureFalling} );
        }
      }
    };
    if( context.socket[0] ) context.socket[0].on('board', boardListener);
    if( context.socket[0] ) context.socket[0].on('hash', hashListener);
    if( context.socket[0] ) context.socket[0].on('figures', figuresListener);
    if( context.socket[0] ) context.socket[0].on('figure_falling', figureFallingListener);
    return () => {
      if( context.socket[0] ) context.socket[0].off('board', boardListener);
      if( context.socket[0] ) context.socket[0].off('hash', hashListener);
      if( context.socket[0] ) context.socket[0].off('figures', figuresListener);
      if( context.socket[0] ) context.socket[0].off('figure_falling', figureFallingListener);
    };
  }, [context.board,context.socket]);
  const [board] = context.board;
  useEffect(() => {
    apiService.fetchBoard(context);
    if( !board.running || board.paused ) {
      if( context.intervalFetch[0] ) clearInterval(context.intervalFetch[0]);
    }
  }, [context,apiService,board.running,board.paused]);
  return (
    <div className="panelTetris">
      {context.board[0].running?
        (context.board[0].paused? renderPaused(): renderFigures(context)):
        (context.board[0].gameOver? renderGameOver(): renderHitEnter())}
    </div>
  );
}

export default PanelTetris;

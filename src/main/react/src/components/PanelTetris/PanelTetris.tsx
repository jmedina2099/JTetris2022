import Long from 'long';
import { useContext, useState, useEffect } from 'react';
import { ApiServiceContext, Game } from '../../App';
import Box, { Caja } from '../Box/Box';
import Figure, { Figura } from '../Figure/Figure';

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
  const first = figuraCayendo? <Figure listBoxes={figuraCayendo.listBoxes}/>: <></>;
  const second = cajas.map( box => <Box key={box.x+"-"+box.y} caja={box}/> );
  return <>{first}{second}</>
}

const PanelTetris = () => {
  const context = useContext(ApiServiceContext);
  context.intervalFetch = useState<NodeJS.Timer>();
  const apiService = context.apiService;
  useEffect(() => {
    let figureFallingWaiting: Figura | undefined = undefined;
    let figuresFixedWaiting: Caja[] | undefined = undefined;
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
          if( figureFallingWaiting ) {
            if( context.board[0].timestamp && figureFallingWaiting.timestamp ) {
              const stampOld = Long.fromString( context.board[0].timestamp );
              const stampNew = Long.fromString( figureFallingWaiting.timestamp );
              if( stampNew.compare(stampOld) === 1 ) { // Only paint if timestamp is greater
                console.log( "1) Painting from rabbitmq" );
                context.board[1]( {...context.board[0], hash: figureFallingWaiting.hashBoard, timestamp: figureFallingWaiting.timestamp, figuresFixed: figures, fallingFigure: figureFallingWaiting } );
              } else {
                console.log( "timestamp is old" );
              }
            } else { // Paint Initial board.
              console.log( "A) Painting from rabbitmq" );
              context.board[1]( {...context.board[0], hash: figureFallingWaiting.hashBoard, timestamp: figureFallingWaiting.timestamp, figuresFixed: figures, fallingFigure: figureFallingWaiting } );
            }
            figureFallingWaiting = undefined;
          } else {
            figuresFixedWaiting = figures; // First arrival, wait.
          }
        }
      }
    };
    const figureFallingListener = (figureFallingCad: string) => {
      //console.log('figureFalling from rabbitmq = ' + figureFallingCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const figureFalling = JSON.parse(figureFallingCad);
        if( figureFalling ) {
          if( figuresFixedWaiting ) {
            if( context.board[0].timestamp && figureFalling.timestamp ) {
              const stampOld = Long.fromString( context.board[0].timestamp );
              const stampNew = Long.fromString( figureFalling.timestamp );
              if( stampNew.compare(stampOld) === 1 ) { // Only paint if timestamp is greater
                console.log( "2) Painting from rabbitmq" );
                context.board[1]( {...context.board[0], hash: figureFalling.hashBoard, timestamp: figureFalling.timestamp, figuresFixed: figuresFixedWaiting, fallingFigure: figureFalling } );
              } else {
                console.log( "timestamp is old" );
              }
            } else { // Paint initial board.
              console.log( "B) Painting from rabbitmq" );
              context.board[1]( {...context.board[0], hash: figureFalling.hashBoard, timestamp: figureFalling.timestamp, figuresFixed: figuresFixedWaiting, fallingFigure: figureFalling } );
            }
            figuresFixedWaiting = undefined;
          } else {
            figureFallingWaiting = figureFalling; // First arrival, wait.
          }
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

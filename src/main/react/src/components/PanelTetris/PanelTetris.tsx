import { useContext, useState, useEffect } from 'react';
import { ApiServiceContext, Game } from '../../App';
import Box, { Caja } from '../Box/Box';
import Figure, { Figura } from '../Figure/Figure';

import "./panelTetris.css";

const renderGameOver = () => {
  return <div className="message"><div className="gameOverLabel">GAME OVER</div></div>;
}

const renderPaused = () => {
  return <div className="message"><div className="pausedLabel">PAUSED</div></div>;
} 

const renderFigures = ( context : Game ) => {
  const figuraCayendo = context.figuraCayendo[0];
  const cajas = context.cajas[0];
  const first = figuraCayendo? <Figure listBoxes={figuraCayendo.listBoxes} hashBoard={figuraCayendo.hashBoard}/>: <></>;
  const second = cajas.map( box => <Box key={box.x+"-"+box.y} caja={box}/> );
  return <>{first}{second}</>
}

const PanelTetris = () => {
  const context = useContext(ApiServiceContext);
  context.cajas = useState<Caja[]>([]);
  context.figuraCayendo = useState<Figura>();
  context.intervalFetch = useState<NodeJS.Timer>();
  const apiService = context.apiService;
  const setBoard = apiService.setBoard;
  const setBoxes = context.cajas[1];
  const setFigureFalling = context.figuraCayendo[1];
  const socket = context.socket[0];
  const setHash = context.hash[1];
  const running = context.running[0];
  const paused = context.paused[0];
  const gameOver = context.gameOver[0];
  useEffect(() => {
    const boardListener = (boardCad: string) => {
      //console.log('board from rabbitmq = ' + boardCad );
      if( running && !paused ) {
        const board = JSON.parse(boardCad);
        setBoard(context,board,[]);
      }
    };
    const hashListener = (hashCad: string) => {
      //console.log('hash from rabbitmq = ' + hashCad );
      if( running && !paused ) {
        const hash = JSON.parse(hashCad);
        setHash(hash);
      }
    };
    const figuresListener = (figuresCad: string) => {
      //console.log('figures from rabbitmq = ' + figuresCad );
      if( running && !paused ) {
        const figures = JSON.parse(figuresCad);
        if( figures ) {
          setBoxes(figures);
        }
      }
    };
    const figureFallingListener = (figureFallingCad: string) => {
      //console.log('figureFalling from rabbitmq = ' + figureFallingCad );
      if( running && !paused ) {
        const figureFalling = JSON.parse(figureFallingCad);
        if( figureFalling ) {
          setFigureFalling(figureFalling);
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
  }, [context,running,paused,socket,setBoard,setHash,setBoxes,setFigureFalling]);
  useEffect(() => {
    apiService.fetchBoard(context);
  }, [context,apiService,running,paused]);
  if( !running || paused ) {
    if( context.intervalFetch[0] ) clearInterval(context.intervalFetch[0]);
  }
  return (
    <div className="panelTetris">
      {running?
        (paused? renderPaused(): renderFigures(context)):
        (gameOver? renderGameOver(): "")}
    </div>
  );
}

export default PanelTetris;



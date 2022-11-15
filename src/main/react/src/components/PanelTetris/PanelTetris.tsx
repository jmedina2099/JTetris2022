import React, { useContext, useState, KeyboardEvent, useEffect, useRef } from 'react';
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
  const setBoxes = context.cajas[1];
  const setFigureFalling = context.figuraCayendo[1];
  const apiService = context.apiService;
  const socket = context.socket[0];
  const [hash,setHash] = context.hash;
  useEffect(() => {
    const boardListener = (boardCad: string) => {
      console.log('board from rabbitmq = ' + boardCad );
      const board = JSON.parse(boardCad);
      apiService.setBoard(context,board,[]);
    };
    const hashListener = (hashCad: string) => {
      console.log('hash from rabbitmq = ' + hashCad );
      const hash = JSON.parse(hashCad);
      setHash(hash);
    };
    const figuresListener = (figuresCad: string) => {
      console.log('figures from rabbitmq = ' + figuresCad );
      const figures = JSON.parse(figuresCad);
      if( figures ) {
        setBoxes(figures);
      }
    };
    const figureFallingListener = (figureFallingCad: string) => {
      console.log('figureFalling from rabbitmq = ' + figureFallingCad );
      const figureFalling = JSON.parse(figureFallingCad);
      if( figureFalling ) {
        setFigureFalling(figureFalling);
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
  }, [context,apiService,socket,setHash,setBoxes,setFigureFalling]);
  const running = context.running[0];
  const paused = context.paused[0];
  const gameOver = context.gameOver[0];
  context.cajas = useState<Caja[]>([]);
  context.figuraCayendo = useState<Figura>();
  context.handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !context.running[0] ) {
          context.apiService.start(context.running[1],context.paused[1]);
        } else {
          context.apiService.pause(context.paused[1],context.running[1]);
        }
        break;
      case "Space":
        context.apiService.space(context.figuraCayendo[1],hash);
        break;
      case "ArrowLeft":
        context.apiService.left(context.figuraCayendo[1],hash);
        break;
      case "ArrowRight":
        context.apiService.right(context.figuraCayendo[1],hash);
        break;
      case "ArrowUp":
        context.apiService.up(context.figuraCayendo[1],hash);
        break
      case "ArrowDown":
        context.apiService.down(context.figuraCayendo[1],hash);
        break
    }
  }
  context.intervalFetch = useState<NodeJS.Timer>();
  useEffect(() => {
    apiService.fetchBoard(context);
  }, [context,apiService,running,paused]);
  if( !running || paused ) {
    if( context.intervalFetch[0] ) clearInterval(context.intervalFetch[0]);
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
    <div className="panelTetris" tabIndex={0} ref={focusDiv} onKeyDown={context.handleKeyboard}>
      {running?
        (paused? renderPaused(): renderFigures(context)):
        (gameOver? renderGameOver(): "")}
    </div>
  );
}

export default PanelTetris;



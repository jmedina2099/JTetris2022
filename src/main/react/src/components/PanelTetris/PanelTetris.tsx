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
  const figuraCayendo = context.figuraCayendo[0];
  const cajas = context.cajas[0];
  const first = figuraCayendo? <Figure listBoxes={figuraCayendo.listBoxes} hashBoard={figuraCayendo.hashBoard}/>: <></>;
  const second = cajas.map( box => <Box key={box.x+"-"+box.y} caja={box}/> );
  return <>{first}{second}</>
}

const PanelTetris = () => {
  const context = useContext(ApiServiceContext);
  const [running] = context.running;
  const [paused] = context.paused;
  const [gameOver] = context.gameOver = useState<boolean>(false);
  const [,setHash] = context.hash;
  const [,setBoxes] = context.cajas = useState<Caja[]>([]);
  const [,setFigureFalling] = context.figuraCayendo = useState<Figura>();
  context.intervalFetch = useState<NodeJS.Timer>();
  const apiService = context.apiService;
  const setBoard = apiService.setBoard;
  const socket = context.socket[0];
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
    if( !running || paused ) {
      if( context.intervalFetch[0] ) clearInterval(context.intervalFetch[0]);
    }
  }, [context,apiService,running,paused]);
  return (
    <div className="panelTetris">
      {running?
        (paused? renderPaused(): renderFigures(context)):
        (gameOver? renderGameOver(): renderHitEnter())}
    </div>
  );
}

export default PanelTetris;

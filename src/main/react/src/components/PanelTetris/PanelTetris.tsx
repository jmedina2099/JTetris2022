import React, { useContext, useState, KeyboardEvent, useEffect, useRef } from 'react';
import { ApiServiceContext } from '../../App';
import Box, { Caja } from '../Box/Box';

import "./panelTetris.css";

const PanelTetris = () => {
  const context = useContext(ApiServiceContext);
  const running = context.running[0];
  const paused = context.paused[0];
  context.cajas = useState<Caja[]>([]);
  context.cajasCayendo = useState<Caja[]>([]);
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
        context.apiService.space(context.cajasCayendo[1]);
        break;
      case "ArrowLeft":
        context.apiService.left(context.cajasCayendo[1]);
        break;
      case "ArrowRight":
        context.apiService.right(context.cajasCayendo[1]);
        break;
      case "ArrowUp":
        context.apiService.up(context.cajasCayendo[1]);
        break
      case "ArrowDown":
        context.apiService.down(context.cajasCayendo[1]);
        break
    }
  }
  const [myInterval1,setMyInterval1] = useState<NodeJS.Timer>();
  const [myInterval2,setMyInterval2] = useState<NodeJS.Timer>();
  useEffect(() => {
    if( running && !paused ) {
      context.apiService.fetchFallingFigure(context.cajasCayendo[1],setMyInterval2);
      context.apiService.fetchFigures(context.cajas[1],setMyInterval1);
    }
  }, [context,running,paused]);
  if( !running || paused ) {
    if( myInterval1 ) clearInterval(myInterval1);
    if( myInterval2 ) clearInterval(myInterval2);
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
    <div className="panelTetris" tabIndex={0} ref={focusDiv} onKeyDown={context.handleKeyboard}>
        {context.cajasCayendo[0].map( box => {
          return <Box key={box.x+"-"+box.y} caja={box}/>;
        })}
        {context.cajas[0].map( box => {
          return <Box key={box.x+"-"+box.y} caja={box}/>;
        })}
    </div>
  );
  }

export default PanelTetris;

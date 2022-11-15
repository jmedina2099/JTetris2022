import { useEffect, useRef, KeyboardEvent, useContext } from 'react';
import { ApiServiceContext } from '../../App';
import PanelLateral from '../PanelLateral/PanelLateral';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";

const VentanaPrincipal = () => {
  const context = useContext(ApiServiceContext);
  const apiService = context.apiService;
  const setFigureFalling = context.figuraCayendo[1];
  const [running,setRunning] = context.running;
  const setPaused = context.paused[1];
  const hash = context.hash[0];
  const handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !running ) {
          apiService.start(setRunning,setPaused);
        } else {
          apiService.pause(setPaused,setRunning);
        }
        break;
      case "Space":
        apiService.space(setFigureFalling,hash);
        break;
      case "ArrowLeft":
        apiService.left(setFigureFalling,hash);
        break;
      case "ArrowRight":
        apiService.right(setFigureFalling,hash);
        break;
      case "ArrowUp":
        apiService.up(setFigureFalling,hash);
        break
      case "ArrowDown":
        apiService.down(setFigureFalling,hash);
        break
    }
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
    <div className="ventanaPrincipal" tabIndex={0} ref={focusDiv} onKeyDown={handleKeyboard}>
      <PanelTetris/>
      <PanelLateral/>
    </div>
  );
}

export default VentanaPrincipal;

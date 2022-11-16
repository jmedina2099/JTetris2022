import { useEffect, useRef, KeyboardEvent, useContext, useState } from 'react';
import { ApiServiceContext, Board, initialBoard } from '../../App';
import PanelLateral from '../PanelLateral/PanelLateral';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";

type VentanaPrincipalProps = {
  handleKeyboard: (e: KeyboardEvent) => void;
}

const VentanaPrincipal = ( {handleKeyboard} : VentanaPrincipalProps ) => {
  const context = useContext(ApiServiceContext);
  context.board = useState<Board>(initialBoard);
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

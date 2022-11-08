import PanelLateral from '../PanelLateral/PanelLateral';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";

const VentanaPrincipal = () => {
  return (
    <div className="ventanaPrincipal" >
      <PanelTetris/>
      <PanelLateral/>
    </div>
  );
}

export default VentanaPrincipal;

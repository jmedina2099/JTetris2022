import React, { useContext, useState } from 'react';
import { ApiServiceContext } from '../../App';

import "./panelLateral.css";

const PanelLateral = () => {
  const context = useContext(ApiServiceContext);
  context.score = useState<number>(0);
  return (
    <div className="panelLateral">
      <div className="score">
        <div className="scoreLabel">{context.score[0]}</div>
      </div>
    </div>
  );
  }

export default PanelLateral;
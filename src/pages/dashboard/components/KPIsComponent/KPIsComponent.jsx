import React from "react";
import "./KPIsComponent.css";

const KPIsComponent = ({ valor, texto, alertColor }) => {
  return (
    <div className="card-kpi">
      <span style={{ borderLeft: `10px solid var(${alertColor})` }}>
        {valor}
      </span>
      <p>{texto}</p>
    </div>
  );
};

export default KPIsComponent;

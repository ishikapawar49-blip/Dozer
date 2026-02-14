import React from "react";
import "../styles/gauge.css";

const GaugeMeter = ({ label, value, max, unit }) => {
  const rotation = (value / max) * 180 - 90;

  return (
    <div className="gauge">
      <div className="gauge-circle">
        <div
          className="needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className="center-dot" />
      </div>

      <p className="gauge-label">{label}</p>
      <h3 className="gauge-value">
        {value} {unit}
      </h3>
    </div>
  );
};

export default GaugeMeter;

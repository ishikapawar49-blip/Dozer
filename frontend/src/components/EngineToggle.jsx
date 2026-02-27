import React from "react";
import "../styles/engineToggle.css";

const EngineToggle = ({ engineOn, onToggle }) => {
  return (
    <div className="engine-toggle" onClick={onToggle}>
      <div className={`engine-track ${engineOn ? "on" : "off"}`}>
        <div className="engine-thumb" />
      </div>

      {/* LABEL */}
      <span className="engine-label">
        Engine {engineOn ? "ON" : "OFF"}
      </span>
    </div>
  );
};

export default EngineToggle;

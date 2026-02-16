import React from "react";
import "../styles/engineToggle.css";

const EngineToggle = ({ engineOn, onToggle }) => {
  return (
    <div className="engine-toggle" onClick={onToggle}>
      <div className={`toggle-track ${engineOn ? "on" : "off"}`}>
        <div className="toggle-thumb" />
        <span className="toggle-text">
          {engineOn ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};

export default EngineToggle;

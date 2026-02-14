import React from "react";
import "../styles/indicators.css";

const BatteryIndicator = ({ value, charging }) => {
  const percent = Math.min(100, Math.max(0, ((value - 10) / 3) * 100));

  return (
    <div className="battery">
      <div className="battery-body">
        <div
          className="battery-level"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="battery-text">
        {value.toFixed(1)}V {charging && "⚡"}
      </div>
    </div>
  );
};

export default BatteryIndicator;

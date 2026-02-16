import React from "react";
import "../styles/indicators.css";

const BatteryIndicator = ({ voltage = 0 }) => {
  const percent = Math.max(0, Math.min(100, ((voltage - 11) / (13 - 11)) * 100));

  const getColor = () => {
    if (percent <= 25) return "#ef4444";     // red
    if (percent <= 60) return "#facc15";     // yellow
    return "#22c55e";                        // green
  };

  return (
    <div className="indicator-card">
      <span className="status-label">Battery</span>

      <div className="battery-container">
        <div className="battery-head" />

        <div className="battery-body">
          <div
            className="battery-level"
            style={{
              height: `${percent}%`,
              background: getColor(),
            }}
          />
        </div>
      </div>

      <div className="indicator-value">{percent.toFixed(0)}%</div>
      <div className="indicator-sub">{voltage.toFixed(1)} V</div>
    </div>
  );
};

export default BatteryIndicator;

import React from "react";
import "../styles/indicators.css";

const BatteryIndicator = ({ voltage = 0 }) => {
  const percent = Math.max(0, Math.min(100, ((voltage - 11) / (13 - 11)) * 100));

  const getColor = () => {
    if (percent <= 25) return "#ef4444";
    if (percent <= 60) return "#facc15";
    return "#22c55e";
  };

  return (
    <div className="battery-wrapper">
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

      {/* VALUES */}
      <div className="battery-values">
        <span className="indicator-value">{percent.toFixed(0)}%</span>
        {/* <span className="indicator-sub">{voltage.toFixed(1)} V</span> */}
      </div>
    </div>
  );
};

export default BatteryIndicator;
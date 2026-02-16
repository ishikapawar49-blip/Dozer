import React from "react";
import "../styles/waterLevel.css";

const WaterLevelBar = ({ level = 0 }) => {
  const percent = Math.max(0, Math.min(100, level));

  return (
    <div className="water-card">
      <span className="status-label">Water Level</span>

      <div className="bucket">
        <div className="water" style={{ height: `${percent}%` }} />
      </div>

      <div className="water-text">{percent.toFixed(0)}%</div>
    </div>
  );
};

export default WaterLevelBar;

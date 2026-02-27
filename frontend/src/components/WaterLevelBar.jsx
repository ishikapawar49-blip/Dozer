import React from "react";
import "../styles/waterLevel.css";

const WaterLevelBar = ({ level = 0 }) => {
  const percent = Math.max(0, Math.min(100, level));

  return (
    <div className="water-card">

      <div className="bucket">

        {/* water fill */}
        <div
          className="water"
          style={{ height: `${percent}%` }}
        />

        {/* 🔥 percent INSIDE container */}
        <div className="water-percent-inside">
          {percent.toFixed(0)}%
        </div>

      </div>

    </div>
  );
};

export default WaterLevelBar;

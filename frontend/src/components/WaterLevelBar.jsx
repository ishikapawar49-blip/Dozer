import React from "react";
import "../styles/indicators.css";

const WaterLevelBar = ({ value }) => {
  return (
    <div className="water-container">
      <div
        className={`water-bar ${value < 20 ? "low" : ""}`}
        style={{ height: `${value}%` }}
      />
      <span className="water-text">{value}%</span>
    </div>
  );
};

export default WaterLevelBar;

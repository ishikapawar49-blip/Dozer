import React from "react";
import "../styles/alert.css";

const SystemAlertCard = ({ telemetry }) => {
  if (!telemetry) return null;

  const batteryPercent =
    ((telemetry.batteryStatus - 11) / (13 - 11)) * 100;

  const rows = [
    ["Transmission Pressure", telemetry.transmissionOilPressure, 16, 28],
    ["Transmission Temp", telemetry.transmissionOilTemp, null, 110],
    ["Water Temp", telemetry.waterTemp, null, 90],
    ["Engine Oil", telemetry.engineOilPressure, 1, null],
    ["Battery %", batteryPercent, 25, 90],
    ["Water Level %", telemetry.waterLevel, 30, 85],
  ];

  const getStatus = (value, low, high) => {
    if (low !== null && value < low) return "LOW";
    if (high !== null && value > high) return "HIGH";
    return "NORMAL";
  };

  return (
    <div className="alert-card">
      <h4>System Alerts</h4>

     {rows.map(([name, value, low, high]) => {
  const safeValue = Number(value ?? 0);
  const status = getStatus(safeValue, low, high);

  return (
    <div key={name} className={`alert-row ${status.toLowerCase()}`}>
      <span>{name}</span>
      <span>{safeValue.toFixed(1)}</span>
      <span>{status}</span>
    </div>
  );
})}
    </div>
  );
};

export default SystemAlertCard;

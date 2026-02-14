import React, { useEffect, useState } from "react";
import socket from "../services/socket";
import GaugeMeter from "../components/GaugeMeter";
import BatteryIndicator from "../components/BatteryIndicator";
import WaterLevelBar from "../components/WaterLevelBar";
import AlertBox from "../components/AlertBox";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("telemetry", setData);
  }, []);

  if (!data) return <h2 className="loading">Loading telemetry...</h2>;

  return (
    <div className="dashboard">
      <h1>Dozer Telemetry Dashboard 🚜</h1>

      <div className="gauges">
        <GaugeMeter label="Transmission Pressure" value={data.transmissionOilPressure} max={3} unit="bar" />
        <GaugeMeter label="Transmission Temp" value={data.transmissionOilTemp} max={140} unit="°C" />
        <GaugeMeter label="Engine Oil Pressure" value={data.engineOilPressure} max={9} unit="bar" />
        <GaugeMeter label="Water Temp" value={data.waterTemp} max={120} unit="°C" />
      </div>

      <div className="indicators">
        <BatteryIndicator value={data.batteryStatus} charging={data.batteryCharging} />
        <WaterLevelBar value={data.waterLevel} />
      </div>

      <AlertBox data={data} />
    </div>
  );
};

export default Dashboard;

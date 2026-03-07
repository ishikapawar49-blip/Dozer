import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import GaugeMeter from "../components/GaugeMeter";
import BatteryIndicator from "../components/BatteryIndicator";
import WaterLevelBar from "../components/WaterLevelBar";
import EngineToggle from "../components/EngineToggle";
import { playBeep, initAudio } from "../utils/PlayAlert";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SystemAlertCard from "../components/SystemAlertCard";
import "../styles/dashboard.css";

/* ================= API ================= */

const TELEMETRY_API = "http://localhost:5000/api/telemetry";

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState(null);
  const lastAlerts = useRef({});
  const [engineOn, setEngineOn] = useState(false);
  const [searchParams] = useSearchParams();
const vehicle = searchParams.get("vehicle");
  const isEmbedded = window.self !== window.top;

  const fetchTelemetryForVehicle = async (vehicleNumber) => {
  try {
    const res = await axios.get(
      `${TELEMETRY_API}/${vehicleNumber}`
    );
    setTelemetry(res.data);
    setEngineOn(res.data.engineOn);
  } catch (err) {
    console.log("No telemetry for vehicle");
  }
};

  // 📡 TELEMETRY + SOCKET useEffect
useEffect(() => {

  // ✅ Agar vehicle param hai to vehicle-specific fetch karo
 const url = `${TELEMETRY_API}/all-latest`;

  axios
    .get(url)
   .then((res) => {
  const data = Array.isArray(res.data)
    ? res.data.find(d => d.vehicleNumber === vehicle)
    : res.data;

  if (data) {
    setTelemetry(data);
    setEngineOn(data.engineOn);
  }
})
    .catch(() => console.log("No telemetry yet"));

 const handler = (data) => {

if (vehicle && data.vehicleNumber !== vehicle) return;
  setTelemetry(data);
  setEngineOn(data.engineOn);

  const checks = {
    transmissionPressure: data.transmissionOilPressure,
    transmissionTemp: data.transmissionOilTemp,
    waterTemp: data.waterTemp,
    engineOil: data.engineOilPressure,
    battery: ((data.batteryStatus - 11) / (13 - 11)) * 100,
    waterLevel: data.waterLevel,
  };

  Object.entries(checks).forEach(([key, value]) => {
    const status = getStatus(key, value);
    const prev = lastAlerts.current[key];

    if (status !== "normal" && prev !== status) {
      playBeep(status === "low" ? "low" : "full");
      lastAlerts.current[key] = status;
    }

    if (status === "normal") {
      lastAlerts.current[key] = "normal";
    }
  });
};

  socket.on("telemetry", handler);


  // NEW ALL ALERT

  const getStatus = (name, value) => {
  switch (name) {
    case "transmissionPressure":
      if (value < 16) return "low";
      if (value > 28) return "high";
      return "normal";

    case "transmissionTemp":
      if (value > 110) return "high";
      return "normal";

    case "waterTemp":
      if (value > 90) return "high";
      return "normal";

    case "engineOil":
      if (value < 1) return "low";
      return "normal";

    case "battery":
      if (value < 25) return "low";
      if (value > 90) return "high";
      return "normal";

    case "waterLevel":
      if (value < 30) return "low";
      if (value > 85) return "high";
      return "normal";

    default:
      return "normal";
  }
};

  // ✅ CORRECT CLEANUP
  return () => {
    socket.off("telemetry", handler);
  };
}, [vehicle]);
  /* ========================================
     Loading Screen
  ======================================== */
  if (!telemetry) return <div className="loading">Connecting to Dozer…</div>;

return (
 <div className="dashboard">
  <div className="layout-center">

    {/* ===== TOP LEFT BUTTONS ===== */}

{/* ===== ENGINE TOP LEFT ===== */}
<div className="engine-panel">
  <EngineToggle engineOn={telemetry.engineOn} />
</div>

    {/* ===== TOP RIGHT BIG BATTERY ===== */}
    <div className="top-right-battery">
      <BatteryIndicator voltage={telemetry.batteryStatus} />
    </div>
    <div className="top-right-alert">
  <SystemAlertCard telemetry={telemetry} />
</div>

    {/* ===== CENTER GAUGES ===== */}
    <div className="gauge-row">

      <GaugeMeter
        id="transmissionPressure"
        label={"TRANSMISSION\nPRESSURE\nin bar"}
        value={telemetry.transmissionOilPressure}
        min={0}
        max={35}
        unit="bar"
      />

      <GaugeMeter
        id="transmissionTemp"
        label={"TRANSMISSION\nTEMP\nin °C"}
        value={telemetry.transmissionOilTemp}
        min={40}
        max={140}
        unit="°C"
      />

      <GaugeMeter
        id="engineOil"
        label={"ENGINE OIL\nPRESSURE\nin bar"}
        value={telemetry.engineOilPressure}
        min={0}
        max={9}
        unit="bar"
      />

      <GaugeMeter
        id="waterTemp"
        label={"WATER\nTEMP\nin °C"}
        value={telemetry.waterTemp}
        min={40}
        max={120}
        unit="°C"
      />
    </div>
        <div className="status-box">
 <div className="right-water">
      <WaterLevelBar level={telemetry.waterLevel} />
    </div>
      </div>
     </div>

  </div>
  );
};

export default Dashboard;
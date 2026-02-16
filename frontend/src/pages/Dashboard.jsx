import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

import GaugeMeter from "../components/GaugeMeter";
import BatteryIndicator from "../components/BatteryIndicator";
import WaterLevelBar from "../components/WaterLevelBar";
import EngineToggle from "../components/EngineToggle";
import { playBeep, initAudio } from "../utils/PlayAlert";

import { useRef } from "react";
import "../styles/dashboard.css";

/* ================= API ================= */

const TELEMETRY_API = "http://localhost:5000/api/telemetry";

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState(null);
  const lastAlert = useRef(null);
  const [engineOn, setEngineOn] = useState(false);

  // 🔊 SOUND ENABLE useEffect
  useEffect(() => {
    const enableSound = () => {
      initAudio();
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("click", enableSound);
    return () => window.removeEventListener("click", enableSound);
  }, []);

  // 📡 TELEMETRY + SOCKET useEffect
useEffect(() => {
  axios
    .get(`${TELEMETRY_API}/latest`)
    .then((res) => {
      setTelemetry(res.data);
      setEngineOn(res.data.engineOn);
    })
    .catch(() => console.log("No telemetry yet"));

  const handler = (data) => {
    setTelemetry(data);
    setEngineOn(data.engineOn);

    const level = data.waterLevel;
    const prev = lastAlert.current;

    console.log("Water:", level, "Prev:", prev);

    // LOW
    if (level <= 30 && prev !== "low") {
      console.log("🔴 LOW ALERT");
      playBeep("low");
      lastAlert.current = "low";
    }

    // HIGH
    else if (level >= 85 && prev !== "high") {
      console.log("🟢 HIGH ALERT");
      playBeep("full");
      lastAlert.current = "high";
    }

    // NORMAL reset
    else if (level > 30 && level < 85 && prev !== null) {
      console.log("⚪ NORMAL");
      lastAlert.current = null;
    }
  };

  socket.on("telemetry", handler);

  // ✅ CORRECT CLEANUP
  return () => {
    socket.off("telemetry", handler);
  };
}, []);

  /* ========================================
     Loading Screen
  ======================================== */
  if (!telemetry) return <div className="loading">Connecting to Dozer…</div>;

  return (
    <div className="dashboard">

      {/* ================= TOP BAR ================= */}
      {/* <div className="top-bar">
        <EngineToggle engineOn={telemetry.engineOn} />
      </div> */}

      {/* ================= GAUGES ================= */}
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

      {/* ================= LOWER REALTIME PANEL ================= */}
      <div className="bottom-row">

        {/* 🔋 Battery Voltage + % */}
        <BatteryIndicator
          voltage={telemetry.batteryStatus}
          charging={telemetry.batteryCharging}
        />

        {/* 💧 Water Level */}
        <WaterLevelBar level={telemetry.waterLevel} />

        {/* ⚡ Battery Charging */}
        <div className="status-box">
          <span>Battery Charging</span>
          <div className={telemetry.batteryCharging ? "status on" : "status off"}>
            {telemetry.batteryCharging ? "ON" : "OFF"}
          </div>
        </div>

        {/* 🚜 Engine State */}
        <div className="status-box">
          <span>Engine</span>
          <div className={telemetry.engineOn ? "status on" : "status off"}>
            {telemetry.engineOn ? "ON" : "OFF"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

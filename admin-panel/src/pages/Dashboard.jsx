import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import DozerCard from "../components/DozerCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import socket from "../services/socket";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [dozers, setDozers] = useState([]);
  const [selectedDozer, setSelectedDozer] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [alertMap, setAlertMap] = useState({});
  const [popupDozer, setPopupDozer] = useState(null);
const cardsPerPage = 2;

const nextCards = () => {
  if (startIndex + cardsPerPage < activeDozersOnly.length) {
    setStartIndex(startIndex + cardsPerPage);
  }
};

const prevCards = () => {
  if (startIndex - cardsPerPage >= 0) {
    setStartIndex(startIndex - cardsPerPage);
  }
};
  // 🔹 Initial Fetch
useEffect(() => {
  const fetchDozers = async () => {
    try {
     const res = await API.get("/dozers");

      setDozers(res.data);   // 🔥 NO FILTER

      setStartIndex(0);

      // Default selected only first ACTIVE dozer
      const firstActive = res.data.find(d => d.status === "Active");
      if (firstActive) {
        setSelectedDozer(firstActive);
      }

    } catch (err) {
console.error("Dashboard fetch failed", err.response?.data || err.message);    }
  };

  fetchDozers();
}, []);

// alert
useEffect(() => {
  const handler = (data) => {

    const vehicle = data.vehicleNumber;

    let score = 0;

    if (data.transmissionOilPressure < 16 || data.transmissionOilPressure > 28) score++;
    if (data.transmissionOilTemp > 110) score++;
    if (data.waterTemp > 90) score++;
    if (data.engineOilPressure < 1) score++;
    if (data.waterLevel < 30 || data.waterLevel > 85) score++;
    if (((data.batteryStatus - 11) / (13 - 11)) * 100 < 25) score++;

    setAlertMap(prev => ({
      ...prev,
      [vehicle]: {
        score,
        time: Date.now()
      }
    }));

  };

  socket.on("telemetry", handler);
  return () => socket.off("telemetry", handler);
}, []);

// sorted
const sortedDozers = useMemo(() => {
  return [...dozers].sort((a, b) => {

    if (a.status !== b.status) {
      return a.status === "Active" ? -1 : 1;
    }

    const aData = alertMap[a.vehicleNumber] || { score: 0, time: Infinity };
    const bData = alertMap[b.vehicleNumber] || { score: 0, time: Infinity };

    if (bData.score !== aData.score) {
      return bData.score - aData.score;
    }

    return bData.time - aData.time;
  });
}, [dozers, alertMap]);

// 🔥 Only Active Dozers for Grid
const activeDozersOnly = sortedDozers.filter(
  (d) => d.status === "Active"
);

console.log(sortedDozers.map(d => ({
  vehicle: d.vehicleNumber,
  score: alertMap[d.vehicleNumber]?.score || 0
})));

// Get top 2 vehicles by score
const topTwoVehicles = sortedDozers
  .slice(0, 2)
  .map(d => d.vehicleNumber);

  // 🔹 Real-time Socket Update
  return (
  <>
    <div className="dashboard">
      <div className="dashboard-header">
      </div>

      {/* 🔥 Dynamic Vehicle Tabs */}
<div className="dozer-tabs">
  {sortedDozers.map((d, index) => (
    <button
  key={d.vehicleNumber}
  disabled={d.status !== "Active"}   // 🔥 disable inactive
  className={`dozer-tab 
    ${selectedDozer?.vehicleNumber === d.vehicleNumber ? "active-tab" : ""}
    ${d.status !== "Active" ? "tab-disabled" : ""}
    ${
      d.status === "Active"
        ? alertMap[d.vehicleNumber]?.score > 0
          ? topTwoVehicles.includes(d.vehicleNumber)
            ? "tab-red"
            : "tab-yellow"
          : "tab-green"
        : ""
    }`}
  onClick={() => {
    if (d.status === "Active") {
      setSelectedDozer(d);
    }
  }}
>
  {d.vehicleNumber}
</button>
  ))}
</div>

      {/* 🔥 Selected Dozer Card */}
    <div className="tabview-wrapper">
<div className="tabview-grid">
{activeDozersOnly.map((d, index) => {
  const isVisible =
    index >= startIndex &&
    index < startIndex + cardsPerPage;

  return (
    <div
      key={d.vehicleNumber}
      style={{
        display: isVisible ? "block" : "none"
      }}
    >
<div onClick={() => setPopupDozer(d)} style={{ cursor: "pointer" }}>
  <DozerCard
    title={d.vehicleNumber}
    driverName={d.driverName}
    driverPhone={d.driverPhone}
  />
</div>
    </div>
  );
})}
</div>
    </div>

  <div className="carousel-controls">
    <button onClick={prevCards} disabled={startIndex === 0}>
      <FaChevronLeft />
    </button>

    <button
      onClick={nextCards}
disabled={startIndex + cardsPerPage >= activeDozersOnly.length}
    >
      <FaChevronRight />
    </button>
  </div>

</div>

{popupDozer && (
  <div className="popup-overlay">
    <div className="popup-content">

      <button
        className="popup-close"
        onClick={() => setPopupDozer(null)}
      >
        ✕
      </button>

      <div style={{ height: "100%" }}>
        <DozerCard
          title={popupDozer.vehicleNumber}
          driverName={popupDozer.driverName}
          driverPhone={popupDozer.driverPhone}
        />
      </div>

    </div>
  </div>
)}
</>
  );
};

export default Dashboard;
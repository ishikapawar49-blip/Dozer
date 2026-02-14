import React from "react";

const AlertBox = ({ data }) => {
  const alerts = [];

  if (data.waterTemp > 100) alerts.push("⚠ High Water Temperature");
  if (data.engineOilPressure < 1) alerts.push("⚠ Low Engine Oil Pressure");
  if (data.waterLevel < 20) alerts.push("⚠ Low Water Level");
  if (data.batteryStatus < 11) alerts.push("⚠ Low Battery");

  return (
    <div style={{ marginTop: 20 }}>
      {alerts.map((a, i) => (
        <div
          key={i}
          style={{
            background: "#ff4d4f",
            color: "white",
            padding: 10,
            marginBottom: 5,
            borderRadius: 6,
          }}
        >
          {a}
        </div>
      ))}
    </div>
  );
};

export default AlertBox;

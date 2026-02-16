import React from "react";
import * as d3 from "d3";
import "../styles/gauge.css";

const GaugeMeter = ({ id, label, value, min = 0, max, unit }) => {
  const size = 240;
  const center = size / 2;
  const radius = 95;

  /* ===== SCALE ===== */
  const scale = d3
    .scaleLinear()
    .domain([min, max])
   .range([-Math.PI * 0.8, Math.PI * 0.8]);

  const angle = scale(value);

  /* ===== ARC ===== */
  const arc = d3.arc().innerRadius(radius - 14).outerRadius(radius);
  let zones = [];

if (id === "transmissionPressure") {
  zones = [
    { from: 0, to: 16, color: "zone-red" },
    { from: 16, to: 28, color: "zone-green" },
    { from: 28, to: 35, color: "zone-red" },
  ];
}

else if (id === "transmissionTemp") {
  zones = [
    { from: 40, to: 110, color: "zone-green" },
    { from: 110, to: 140, color: "zone-red" },
  ];
}

else if (id === "engineOil") {
  zones = [
    { from: 0, to: 1, color: "zone-red" },
    { from: 1, to: 9, color: "zone-green" },
  ];
}

else if (id === "waterTemp") {
  zones = [
    { from: 40, to: 90, color: "zone-green" },
    { from: 90, to: 120, color: "zone-red" },
  ];
}


  /* ===== EXACT TICKS for Transmission ===== */
  const transmissionTicks = [0, 4, 8, 12, 16, 20, 24, 28, 32, 35];

const transmissionTempMajor = [40, 60, 80, 100, 110, 120, 130, 140];
const transmissionTempMinor = [50, 70]; // ⭐ small tick between 40 & 60

const engineOilMajor = [0,1,2,3,4,5,6,7,8,9];
const engineOilMinor = [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5];

const waterTempMajor = [40, 60, 80, 90, 100, 120];
const waterTempMinor = [50, 70, 95, 110];


const majorTicks =
  id === "transmissionPressure"
    ? transmissionTicks
    : id === "transmissionTemp"
    ? transmissionTempMajor
    : id === "engineOil"
    ? engineOilMajor
    : id === "waterTemp"
    ? waterTempMajor
    : d3.range(min, max + 0.0001, (max - min) / 8);

const minorTicks =
  id === "transmissionTemp"
    ? transmissionTempMinor
    : id === "engineOil"
    ? engineOilMinor
    : id === "waterTemp"
    ? waterTempMinor
    : [];


  return (
    <div className="gauge-wrapper">
      <svg width={size} height={size}>
        <g transform={`translate(${center}, ${center})`}>

          {/* ===== OUTER METAL RING ===== */}
          <circle r={radius + 10} className="ring-outer" />
          <circle r={radius} className="ring-inner" />

          {/* ===== COLOR ZONES ===== */}
        {/* ===== COLOR ZONES ===== */}
{zones.map((z, i) => (
  <path
    key={i}
    d={arc({
      startAngle: scale(z.from),
      endAngle: scale(z.to),
    })}
    className={z.color}
  />
))}


          {/* ===== TICKS + NUMBERS ===== */}
          {majorTicks.map((t, i) => {
           const digitOffset =-1.57; // ⭐ tuning value for perfect OEM alignment
           const a = scale(t) + digitOffset;


            const x1 = Math.cos(a) * (radius - 20);
            const y1 = Math.sin(a) * (radius - 20);
            const x2 = Math.cos(a) * (radius - 6);
            const y2 = Math.sin(a) * (radius - 6);

            const tx = Math.cos(a) * (radius - 34);
            const ty = Math.sin(a) * (radius - 34);

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="tick-line" />
                <text x={tx} y={ty} className="tick-number">
                  {t}
                </text>
              </g>
            );
          })}

          {/* ===== MINOR TICKS (no numbers) ===== */}
{/* ===== MINOR TICKS ===== */}
{minorTicks.map((t, i) => {
  const digitOffset = -1.57;
  const a = scale(t) + digitOffset;

  const x1 = Math.cos(a) * (radius - 18);
  const y1 = Math.sin(a) * (radius - 18);
  const x2 = Math.cos(a) * (radius - 8);
  const y2 = Math.sin(a) * (radius - 8);

  const minorTextRadius =
    id === "engineOil" ? radius - 25 : radius - 40;

  const tx = Math.cos(a) * minorTextRadius;
  const ty = Math.sin(a) * minorTextRadius;

  return (
    <g key={`minor-${i}`}>
      {/* small tick (hide only for engine oil) */}
      {id !== "engineOil" && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="tick-line"
          style={{ strokeWidth: 1.2, opacity: 0.6 }}
        />
      )}

      {/* ⭐ Engine oil minor numbers */}
      {id === "engineOil" && (
        <text
          x={tx}
          y={ty}
          className="tick-number"
          style={{ fontSize: "9px", opacity: 0.9 }}
        >
          {t}
        </text>
      )}
    </g>
  );
})}

          {/* ===== NEEDLE ===== */}
          <g transform={`rotate(${(angle * 180) / Math.PI})`}>
            <line y1="12" y2={-radius + 22} className="needle" />
          </g>

          {/* ===== CENTER DOT ===== */}
          <circle r="7" className="needle-center" />

          {/* ===== LABEL ===== */}
  {/* ===== LABEL ===== */}
<text y="10" textAnchor="middle" className="gauge-label">
  {label.split("\n").map((line, i) => (
    <tspan key={i} x="0" dy={i === 0 ? 0 : 12}>
      {line}
    </tspan>
  ))}
</text>

          {/* ===== VALUE ===== */}
          <text y="50" textAnchor="middle" className="gauge-value">
            {value.toFixed(1)} {unit}
          </text>

          {/* ===== MIN / MAX TEXT ===== */}
{/* ===== MIN / MAX TEXT (only for non-temp meters) ===== */}
{!["transmissionTemp", "waterTemp"].includes(id) && (
  <>
    <text
      x={-radius + 48}
      y={radius - 18}
      className="minmax"
      fill="white"
      fontSize="8"
    >
      MIN
    </text>

    <text
      x={radius - 64}
      y={radius - 18}
      className="minmax"
      fill="white"
      fontSize="8"
    >
      MAX
    </text>
  </>
)}
        </g>
      </svg>
    </div>
  );
};

export default GaugeMeter;

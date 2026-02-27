import React, { memo, useState, useRef, useEffect } from "react";

const DozerCard = ({ title, driverName, driverPhone }) => {
  const [showDriver, setShowDriver] = useState(false);
  const cardRef = useRef(null);

  // Close when clicking outside card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target)
      ) {
        setShowDriver(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="dozer-card"
      ref={cardRef}
      style={{ position: "relative" }}
    >
      {/* 🔥 Badge (toggle open/close) */}
      <div
        className="vehicle-badge"
        onClick={(e) => {
          e.stopPropagation();
          setShowDriver((prev) => !prev); // ✅ toggle
        }}
        style={{ cursor: "pointer" }}
      >
        {title}
      </div>

      {/* 🔥 Smooth Animated Popup */}
      <div className={`driver-popup ${showDriver ? "show" : ""}`}>
        <div><strong>Driver:</strong> {driverName || "Not Assigned"}</div>
        <div><strong>Phone:</strong> {driverPhone || "Not Available"}</div>
      </div>

     <iframe
  src={`http://localhost:5174/?vehicle=${title}`}
  className="dozer-iframe"
  title={title}
  loading="eager"
/>
    </div>
  );
};

export default memo(DozerCard);
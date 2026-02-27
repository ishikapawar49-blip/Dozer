import { useState } from "react";
import { FaMoon, FaBell } from "react-icons/fa";
import "../styles/topbar.css";

export default function Topbar({ notifications = [] }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="topbar">
      <h3 className="topbar-title">Admin Panel</h3>

      <div className="topbar-right">

        <button className="icon-btn">
          <FaMoon />
        </button>

        {/* 🔔 Notification */}
        <div className="notification-wrapper">
          <button
            className="icon-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell />

            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? (
                <p>No upcoming services</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="notification-item">
                    🚜 {n.dozerId?.vehicleNumber} service on{" "}
                    {new Date(n.nextServiceDate).toLocaleDateString()}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Profile replaced with A */}
        <div className="profile-circle">
          A
        </div>

      </div>
    </header>
  );
}

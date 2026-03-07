import { useState, useEffect } from "react";
import { FaMoon, FaBell } from "react-icons/fa";
import API from "../services/api";
import "../styles/navbar.css";

export default function Topbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);

useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  const res = await API.get("/notifications");
  setNotifications(res.data);
};

  return (
    <header className="navbar">
      <h3 className="navbar-title">User Panel</h3>

      <div className="navbar-right">

        <button className="navbar-icon-btn">
          <FaMoon />
        </button>

        {/* 🔔 Notification */}
        <div className="navbar-notification-wrapper">
          <button
            className="navbar-icon-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBell />

            {notifications.length > 0 && (
              <span className="navbar-notification-badge">
                {notifications.length}
              </span>
            )}
          </button>
          
  {showDropdown && (
  <div className="navbar-notification-dropdown">

    {notifications.length === 0 ? (
      <p>No notifications</p>
    ) : (
      notifications.map((n) => (
        <div key={n._id} className="navbar-notification-item">
          🔔 {n.message}
        </div>
      ))
    )}

  </div>
)}
        </div>

        {/* 👤 Profile replaced with A */}
        <div className="navbar-profile-circle">
          U
        </div>

      </div>
    </header>
  );
}

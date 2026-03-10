import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaTools,
  FaTruckMoving,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";

import "../styles/sidebar.css";

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // remove stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dozer");

    // redirect to login
    navigate("/login");

  };

  return (
    <aside className="user-sidebar">

      {/* Logo */}
      <div className="user-sidebar-logo">
        <h2>DOZER</h2>
      </div>

      {/* Menu */}
      <nav className="user-sidebar-menu">

        <NavLink to="/user/dashboard">
          <FaTruckMoving className="user-sidebar-icon" />
          Dashboard
        </NavLink>

       <NavLink to="/user/profile">
  <FaUser className="user-sidebar-icon" />
  Profile
</NavLink>

        <NavLink to="/user/service-management">
          <FaTools className="user-sidebar-icon" />
          Service Management
        </NavLink>

      </nav>

      {/* Logout */}
      <button
        className="user-sidebar-logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> Logout
      </button>

    </aside>
  );
}
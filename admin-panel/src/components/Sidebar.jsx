import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaTools, 
  FaTruckMoving, 
  FaSignOutAlt 
} from "react-icons/fa";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <h2>DOZER</h2>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        <NavLink to="/admin/dozer-management">
  <FaTruckMoving className="sidebar-icon" />
  Dozer Management
</NavLink>

<NavLink to="/admin/dashboard">
  <FaTachometerAlt className="sidebar-icon" />
  Dashboard
</NavLink>

<NavLink to="/admin/service">
  <FaTools className="sidebar-icon" />
  Service Management
</NavLink>

      </nav>

      {/* Logout */}
      <button className="sidebar-logout">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}

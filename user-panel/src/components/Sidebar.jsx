import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Owner Panel</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/vehicles">My Vehicles</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/earnings">Earnings</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
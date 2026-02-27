import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

import "../styles/sidebar.css";
import "../styles/topbar.css";
import "../styles/layout.css";

const AdminLayout = () => {

  const [services, setServices] = useState([]);

  // ✅ Fetch all services once
  useEffect(() => {
    const fetchServices = async () => {
      try {
       const res = await API.get("/dozers");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services");
      }
    };

    fetchServices();
  }, []);

  // ✅ 2 days before notification logic
  const getUpcomingNotifications = () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    return services.filter((s) => {
      const next = new Date(s.nextServiceDate);
      next.setHours(0,0,0,0);

      const diffTime = next - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      return diffDays === 2;
    });
  };

  const upcomingNotifications = getUpcomingNotifications();

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        {/* ✅ Notifications passed here */}
        <TopBar notifications={upcomingNotifications} />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [dozers, setDozers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDozers();
  }, []);

  const fetchDozers = async () => {
    try {
      const res = await API.get("/dozers"); 
      setDozers(res.data);
    } catch (err) {
      console.error("Failed to fetch dozers", err);
    }
    setLoading(false);
  };

  /* ===== COUNTS ===== */

  const total = dozers.length;

  const active = dozers.filter(d => d.status === "Active").length;
  const inactive = dozers.filter(d => d.status === "Inactive").length;

  const upcomingService = dozers.filter(d => {
    if (!d.nextServiceDate) return false;

    const today = new Date();
    const serviceDate = new Date(d.nextServiceDate);

    const diffDays =
      (serviceDate - today) / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 7;
  }).length;

  if (loading) return <div className="content"><h2>Loading...</h2></div>;

  return (
    <div className="content">

      <h1>Welcome Owner 🚜</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Vehicles</h3>
          <h2>{total}</h2>
        </div>

        <div className="card">
          <h3>Active Vehicles</h3>
          <h2>{active}</h2>
        </div>

        <div className="card">
          <h3>Inactive Vehicles</h3>
          <h2>{inactive}</h2>
        </div>

        <div className="card">
          <h3>Upcoming Service (7 days)</h3>
          <h2>{upcomingService}</h2>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
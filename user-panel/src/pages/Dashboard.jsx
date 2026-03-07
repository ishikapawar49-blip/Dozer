import { useEffect, useState } from "react";
import API from "../services/api";
import DozerCard from "../components/UserDozerCard";
import "../styles/dashboard.css";

const Dashboard = () => {

  const [dozer, setDozer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMyDozer = async () => {
      try {

        const res = await API.get("/dozers/my-dozer");

        setDozer(res.data);

      } catch (error) {

        console.log("No dozer allocated");

      } finally {
        setLoading(false);
      }
    };

    fetchMyDozer();

  }, []);

  useEffect(() => {
  document.body.classList.add("dashboard-page");

  return () => {
    document.body.classList.remove("dashboard-page");
  };
}, []);

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  if (!dozer) {
    return (
      <div className="dashboard">
        <h2>No Dozer Allocated</h2>
      </div>
    );
  }
  

  return (
    <div className="user-dashboard">

      <DozerCard
        title={dozer.vehicleNumber}
        driverName={dozer.driverName}
        driverPhone={dozer.driverPhone}
      />

    </div>
  );
};

export default Dashboard;
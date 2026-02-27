import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Wrench, Clock, AlertTriangle } from "lucide-react";
import AddService from "./AddService";
import "../../styles/serviceManagement.css";

const ServiceManagement = () => {

  const [services, setServices] = useState([]);
  const [dozers, setDozers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchDozers();
  }, []);

// notification 
const getUpcomingNotifications = () => {
  const today = new Date();

  return services.filter((s) => {
    const next = new Date(s.nextServiceDate);

    // remove time difference issue
    today.setHours(0,0,0,0);
    next.setHours(0,0,0,0);

    const diffTime = next - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays === 2;
  });
};

const upcomingNotifications = getUpcomingNotifications();

  const fetchServices = async () => {
    const res = await axios.get("http://localhost:5000/api/services");
    setServices(res.data);
  };

  const fetchDozers = async () => {
    const res = await axios.get("http://localhost:5000/api/dozers");
    setDozers(res.data);
  };

  const getStatus = (nextDate) => {
    const today = new Date();
    const serviceDate = new Date(nextDate);

    if (serviceDate < today) return "Overdue";
    return "Upcoming";
  };

  const handleEdit = (id) => {
  navigate(`/admin/service/add-service/${id}`);
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this service?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/services/${id}`);
    fetchServices(); // refresh table
  } catch (err) {
    console.error("Delete failed");
  }
};

  return (
    <div className="service-page">

<div className="service-header">

  {/* Left side - Stat Cards */}
  <div className="service-stats">
    <div className="service-stat-card">
  <div className="stat-icon">
    <Wrench size={28} />
  </div>
  <div className="stat-content">
    <div className="stat-number">{services.length}</div>
    <div className="stat-label">Total Services</div>
  </div>
</div>

<div className="service-stat-card green">
  <div className="stat-icon">
    <Clock size={28} />
  </div>
  <div className="stat-content">
    <div className="stat-number">
      {services.filter(s =>
        getStatus(s.nextServiceDate) === "Upcoming"
      ).length}
    </div>
    <div className="stat-label">Upcoming</div>
  </div>
</div>

<div className="service-stat-card red">
  <div className="stat-icon">
    <AlertTriangle size={28} />
  </div>
  <div className="stat-content">
    <div className="stat-number">
      {services.filter(s =>
        getStatus(s.nextServiceDate) === "Overdue"
      ).length}
    </div>
    <div className="stat-label">Overdue</div>
  </div>
</div>
  </div>

  {/* Right side - Button */}
  <button
    className="service-primary-btn"
    onClick={() => navigate("/admin/service/add-service")}
  >
    + Add Service
  </button>

</div>
      {/* Table */}
      <div className="service-table-card">
        <table>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Service Type</th>
              <th>Last Service</th>
              <th>Next Service</th>
              <th>Service Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s.dozerId?.vehicleNumber}</td>
                <td>{s.serviceType}</td>
                <td>{new Date(s.serviceDate).toLocaleDateString()}</td>
                <td>{new Date(s.nextServiceDate).toLocaleDateString()}</td>
                <td>₹{s.cost}</td>
                <td>
                  <span
                    className={
                      getStatus(s.nextServiceDate) === "Overdue"
                        ? "status-badge red"
                        : "status-badge green"
                    }
                  >
                    {getStatus(s.nextServiceDate)}
                  </span>
                </td>
                  {/* 👇 NEW ACTIONS COLUMN */}
      <td>
        <div className="service-actions">
          <button
            className="service-edit-btn"
            onClick={() => handleEdit(s._id)}
          >
            Edit
          </button>

          <button
            className="service-delete-btn"
            onClick={() => handleDelete(s._id)}
          >
            Delete
          </button>
        </div>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ServiceManagement;
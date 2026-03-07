import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Wrench, Clock, AlertTriangle } from "lucide-react";
import AddService from "./AddService";
import "../../styles/serviceManagement.css";

const ServiceManagement = () => {

  const [services, setServices] = useState([]);
  const [dozers, setDozers] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");
const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const navigate = useNavigate();



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

  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/api/services/my-services",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setServices(res.data);
};

const fetchDozers = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/api/dozers",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setDozers(res.data);
};

const handleEdit = (id) => {
  navigate(`/user/service-management/add-service/${id}`);
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

useEffect(() => {

  fetchServices();
  fetchDozers();

  const interval = setInterval(() => {
    fetchServices();
  }, 10000);

  return () => clearInterval(interval);

}, []);

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
{services.filter(s => s.status === "Pending").length}
    </div>
    <div className="stat-label">Pending</div>
  </div>
</div>

<div className="service-stat-card red">
  <div className="stat-icon">
    <AlertTriangle size={28} />
  </div>
  <div className="stat-content">
    <div className="stat-number">
 {services.filter(s => s.status === "Completed").length}
    </div>
    <div className="stat-label">Completed</div>
  </div>
</div>
  </div>

  {/* Right side - Button */}
  <button
    className="service-primary-btn"
    onClick={() => navigate("/user/service-management/add-service")}
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
              <th>Problem Description</th>
              <th>Service Date</th>
              {/* <th>Next Service</th> */}
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
                <td
  className="clickable-description"
  onClick={() => {
    setSelectedDescription(s.description);
    setShowDescriptionPopup(true);
  }}
>
  {s.description?.slice(0,25)}...
</td>
                <td>{new Date(s.serviceDate).toLocaleDateString("en-GB")}</td>
                {/* <td>{new Date(s.nextServiceDate).toLocaleDateString()}</td> */}
                <td>₹{s.cost}</td>
                <td>
                 <span
  className={
    s.status === "Pending"
      ? "status-badge yellow"
      : s.status === "Approved"
      ? "status-badge blue"
      : "status-badge green"
  }
>
  {s.status}
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

        {showDescriptionPopup && (
  <div className="description-modal-overlay">

    <div className="description-modal">

      <div className="description-modal-header">
        <h3>Problem Description</h3>

        <button
          className="close-btn"
          onClick={() => setShowDescriptionPopup(false)}
        >
          ✕
        </button>
      </div>

      <div className="description-modal-body">
        {selectedDescription}
      </div>

    </div>

  </div>
)}
      </div>

    </div>
  );
};

export default ServiceManagement;
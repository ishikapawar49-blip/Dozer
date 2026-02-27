import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "../../styles/dozerManagement.css";

const DozerManagement = () => {
  const [dozers, setDozers] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
 
const handleStatusToggle = async (id, currentStatus) => {
  try {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    await API.put(`/dozers/${id}`, {
      status: newStatus,
    });

    // update UI
    setDozers((prev) =>
      prev.map((d) =>
        d._id === id ? { ...d, status: newStatus } : d
      )
    );
  } catch (err) {
    console.error("Status update failed", err);
  }
};
  const fetchDozers = async () => {
  const res = await API.get("/dozers");
  setDozers(res.data);
};
  useEffect(() => {
    fetchDozers();
  }, []);

const handleEdit = (id) => {
navigate(`/admin/dozer-management/add-dozer/${id}`);
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/dozers/${id}`);

    setDozers((prev) =>
      prev.filter((d) => d._id !== id)
    );
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const filteredDozers = dozers.filter((d) => {
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    d.vehicleNumber?.toLowerCase().includes(term) ||
    d.driverName?.toLowerCase().includes(term);

  const matchesStatus =
    statusFilter === "All" || d.status === statusFilter;

  // 🔥 Service filter logic
  let matchesService = true;

  if (d.nextServiceDate) {
    const today = new Date();
    const serviceDate = new Date(d.nextServiceDate);

    today.setHours(0, 0, 0, 0);
    serviceDate.setHours(0, 0, 0, 0);

    const diffDays =
      (serviceDate - today) / (1000 * 60 * 60 * 24);

    if (serviceFilter === "Overdue") {
      matchesService = diffDays < 0;
    } 
    else if (serviceFilter === "Upcoming") {
      matchesService = diffDays >= 0 && diffDays <= 7;
    } 
    else if (serviceFilter === "Healthy") {
      matchesService = diffDays > 7;
    }
  }

  return matchesSearch && matchesStatus && matchesService;
});

const totalCount = dozers.length;
const activeCount = dozers.filter(d => d.status === "Active").length;
const inactiveCount = dozers.filter(d => d.status === "Inactive").length;

// Return functoion
  return (
    <div className="wrapper">

      {/* HEADER */}
      <div className="add-page-header">

 <div className="stats-cards">

  <div className="stat-card dark-card total-card">
    <div className="card-icon">
      <FiTruck />
    </div>
    <div>
      <h2>{totalCount}</h2>
      <p>Total Dozers</p>
    </div>
  </div>

  <div className="stat-card dark-card active-card">
    <div className="card-icon">
      <FiCheckCircle />
    </div>
    <div>
      <h2>{activeCount}</h2>
      <p>Active</p>
    </div>
  </div>

  <div className="stat-card dark-card inactive-card">
    <div className="card-icon">
      <FiXCircle />
    </div>
    <div>
      <h2>{inactiveCount}</h2>
      <p>Inactive</p>
    </div>
  </div>

  </div>

  <button
    className="primary-btn"
    onClick={() => navigate("/admin/dozer-management/add-dozer")}
  >
    + Add Dozer
  </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="add-page-toolbar">
        <div className="search-box">
             <FiSearch className="search-icon" />
    <input
      placeholder="Search Vehicle number, Driver Name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

        </div>

        <div className="toolbar-actions">
          <select
  className="filter-dropdown"
  value={serviceFilter}
  onChange={(e) => setServiceFilter(e.target.value)}
>
  <option value="All">All Services</option>
  <option value="Overdue">Overdue</option>
  <option value="Upcoming">Upcoming (7 days)</option>
  <option value="Healthy">Healthy</option>
</select>

         <select
  className="filter-dropdown"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="All">All</option>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="dozer-table">
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Model</th>
              <th>Manufacturing Year</th>
              <th>Expiry Year</th>
              <th>Driver Name</th>
              <th>Phone Number</th>
              <th>License Number</th>
              <th>Last Service</th>
              <th>Next Service</th>
              <th>Status</th>
               <th>Owner</th> 
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDozers.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No dozers found
                </td>
              </tr>
            ) : (
             filteredDozers.map((d) => (
                <tr key={d._id}>
                  <td>{d.vehicleNumber}</td>
                  <td>{d.model}</td>
                  <td>{d.year}</td>
                  <td>
  {d.year && d.expectedLifeYears
    ? Number(d.year) + Number(d.expectedLifeYears)
    : "-"}
</td>
                  <td>{d.driverName}</td>
                  <td>{d.driverPhone}</td>
                  <td>{d.licenseNumber}</td>
                  <td>{d.lastServiceDate?.split("T")[0]}</td>
                  <td>{d.nextServiceDate?.split("T")[0]}</td>
                 <td>
  <div className="status-toggle-wrapper">
    <label className="switch">
      <input
        type="checkbox"
        checked={d.status === "Active"}
        onChange={() => handleStatusToggle(d._id, d.status)}
      />
      <span className="slider"></span>
    </label>

    <span
      className={`status-text ${
        d.status === "Active" ? "active-text" : "inactive-text"
      }`}
    >
      {d.status}
    </span>
  </div>
</td>

<td>{d.owner?.name}</td>

<td className="action-cell">
  <div className="action-buttons">
    <button
      className="edit-btn"
      onClick={() => handleEdit(d._id)}
    >
      Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(d._id)}
    >
      Delete
    </button>
  </div>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DozerManagement;

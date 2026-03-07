import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Wrench, Clock, AlertTriangle } from "lucide-react";
import "../../styles/serviceManagement.css";

const ServiceManagement = () => {

  const [services, setServices] = useState([]);
const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
const [selectedDescription, setSelectedDescription] = useState("");
const [openDriverRow, setOpenDriverRow] = useState(null);
const dropdownRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpenDriverRow(null);
    }

  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };

}, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/services/${id}`, {
        status,
      });

      fetchServices();
    } catch (err) {
      console.error("Status update failed");
    }
  };

  return (
    <div className="service-page">

      {/* HEADER */}
      <div className="service-header">

        <div className="service-stats">

          <div className="service-stat-card">
            <div className="stat-icon">
              <Wrench size={28}/>
            </div>

            <div className="stat-content">
              <div className="stat-number">{services.length}</div>
              <div className="stat-label">Total Services</div>
            </div>
          </div>

          <div className="service-stat-card green">
            <div className="stat-icon">
              <Clock size={28}/>
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
              <AlertTriangle size={28}/>
            </div>

            <div className="stat-content">
              <div className="stat-number">
                {services.filter(s => s.status === "Completed").length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="service-table-card">

        <table>

          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Service Type</th>
              <th>Problem Description</th>
              <th>Service Date</th>
              <th>Service Cost</th>
              <th>Status</th>
            </tr>
            
          </thead>

          <tbody>

            {services.map((s) => (

              <tr key={s._id}>

<td className="vehicle-cell">

  <span
    className="vehicle-click"
    onClick={() =>
      setOpenDriverRow(openDriverRow === s._id ? null : s._id)
    }
  >
    {s.dozerId?.vehicleNumber}
  </span>

  {openDriverRow === s._id && (
   <div className="driver-dropdown" ref={dropdownRef}>

      <div><strong>Name:</strong> {s.dozerId?.driverId?.name}</div>
      <div><strong>Phone:</strong> {s.dozerId?.driverId?.phone}</div>
      <div><strong>Email:</strong> {s.dozerId?.driverId?.email}</div>

    </div>
  )}

</td>

                <td>{s.serviceType}</td>

 <td
  className="desc-cell"
  onClick={() => {
    setSelectedDescription(s.description);
    setShowDescriptionPopup(true);
  }}
>
  {s.description.length > 40
    ? s.description.slice(0, 40) + "..."
    : s.description}
</td>

                <td>
                  {new Date(s.serviceDate).toLocaleDateString()}
                </td>

                <td>₹{s.cost}</td>

                <td>

                  <select
                    className="status-dropdown"
                    value={s.status}
                    onChange={(e) =>
                      updateStatus(s._id, e.target.value)
                    }
                  >

                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>

                  </select>

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
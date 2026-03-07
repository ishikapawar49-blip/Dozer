import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUsers } from "react-icons/fi";
import "../../styles/dozerManagement.css";

const UserManagement = () => {

  const [users,setUsers] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [driverDozer, setDriverDozer] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(()=>{
    fetchUsers();
  },[]);

  const handleEdit = (id) =>{
    navigate(`/admin/user-management/add-user/${id}`);
  }

  const handleDelete = async(id)=>{
    if(!window.confirm("Delete user?")) return;

    await API.delete(`/users/${id}`);

    setUsers(prev => prev.filter(u => u._id !== id));
  }

  const filteredUsers = users.filter(u=>{
    const term = searchTerm.toLowerCase();

    return(
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.includes(term)
    )
  });

const openDriverDozer = async (driverId) => {
  try {

    const res = await API.get(`/dozers/driver/${driverId}`);

    if (!res.data) {
      alert("No dozer allotted");
      return;
    }

    setDriverDozer(res.data);
    setShowModal(true);

  } catch (err) {
    alert("No dozer allotted");
  }
};

  return (
    <div className="wrapper">

      {/* HEADER */}
      <div className="add-page-header">

        <div className="stats-cards">

          <div className="stat-card dark-card total-card">
            <div className="card-icon">
              <FiUsers />
            </div>

            <div>
              <h2>{users.length}</h2>
              <p>Total Users</p>
            </div>

          </div>

        </div>

        <button
          className="primary-btn"
          onClick={()=>navigate("/admin/user-management/add-user")}
        >
          + Add User
        </button>

      </div>


      {/* SEARCH */}
      <div className="add-page-toolbar">

        <div className="search-box">

          <FiSearch className="search-icon"/>

          <input
            placeholder="Search name, email, phone"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />

        </div>

      </div>


      {/* TABLE */}

      <div className="card">

        <table className="dozer-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map(u =>(

              <tr key={u._id}>

                <td
  className="clickable-name"
onClick={() => openDriverDozer(u._id)}>
  {u.name}
</td>
                <td>{u.dob?.split("T")[0]}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.license}</td>

                <td className="action-cell">

                  <div className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={()=>handleEdit(u._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={()=>handleDelete(u._id)}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

    {showModal && driverDozer && (

<div className="dozer-modal-overlay">

  <div className="dozer-modal">

    <div className="dozer-modal-header">
      <h2>🚜 Driver Dozer Details</h2>
      <button
        className="close-btn"
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
    </div>

    <div className="dozer-grid">

      <div className="dozer-item">
        <span>Vehicle Number</span>
        <strong>{driverDozer.vehicleNumber}</strong>
      </div>

      <div className="dozer-item">
        <span>Model Number</span>
        <strong>{driverDozer.model}</strong>
      </div>

      <div className="dozer-item">
        <span>Brand Name</span>
        <strong>{driverDozer.brand}</strong>
      </div>

      <div className="dozer-item">
        <span>Manufacturing Year</span>
        <strong>{driverDozer.year}</strong>
      </div>

      <div className="dozer-item">
        <span>Driver Name</span>
        <strong>{driverDozer.driverName}</strong>
      </div>

      <div className="dozer-item">
        <span>Phone Number</span>
        <strong>{driverDozer.driverPhone}</strong>
      </div>

      <div className="dozer-item">
        <span>License Number</span>
        <strong>{driverDozer.licenseNumber}</strong>
      </div>

      <div className="dozer-item">
        <span>Purchase Date</span>
        <strong>{driverDozer.purchaseDate?.split("T")[0]}</strong>
      </div>

      <div className="dozer-item">
        <span>Last Service</span>
        <strong>{driverDozer.lastServiceDate?.split("T")[0]}</strong>
      </div>

      <div className="dozer-item">
        <span>Next Service</span>
        <strong>{driverDozer.nextServiceDate?.split("T")[0]}</strong>
      </div>

      <div className="dozer-item">
        <span>Service Cost</span>
        <strong>₹ {driverDozer.serviceCost}</strong>
      </div>

      <div className="dozer-item status">
        <span>Status</span>
        <strong>{driverDozer.status}</strong>
      </div>

    </div>

  </div>

</div>

)}

      </div>

    </div>
  );
};

export default UserManagement;
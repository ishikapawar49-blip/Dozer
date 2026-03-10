import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Truck,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import "../styles/profile.css";

const Profile = () => {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/users/me");
    setData(res.data);

    setForm({
      name: res.data.name || "",
      email: res.data.email || "",
      phone: res.data.phone || "",
      fullAddress: res.data.address?.fullAddress || "",
      city: res.data.address?.city || "",
      state: res.data.address?.state || "",
      pincode: res.data.address?.pincode || "",
    });
  };
const handleChange = async (e) => {
  let { name, value } = e.target;

  if (name === "phone") value = value.replace(/\D/g, "").slice(0, 10);
  if (name === "pincode") {
    value = value.replace(/\D/g, "").slice(0, 6);

    // जब 6 digit complete हो जाए
    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];

          setForm((prev) => ({
            ...prev,
            pincode: value,
            city: postOffice.District,
            state: postOffice.State
          }));

          return;
        }
      } catch (err) {
        console.log("Pincode fetch failed", err);
      }
    }
  }

  setForm({ ...form, [name]: value });
};

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await API.put("/users/me", form);
      setData(res.data);
      setEdit(false);
    } catch (err) {
      alert("Update failed");
    }
    setLoading(false);
  };

  if (!data) return <div className="user-prof-page">Loading...</div>;

  return (
    <div className="user-prof-page">

      <div className="user-prof-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {/* Stats Cards */}
      <div className="user-prof-stats">
        <div className="user-prof-stat-card">
         <div className="user-prof-stat-icon user-prof-blue">
  <Truck size={26} strokeWidth={2.5} />
</div>
          <div>
            <h2>{data.totalVehicles}</h2>
<span>Total Vehicles</span>
          </div>
        </div>

        <div className="user-prof-stat-card">

<div className="user-prof-stat-icon user-prof-green">
  <CheckCircle size={26} strokeWidth={2.5} />
</div>
          <div>
           <h2>{data.activeVehicles}</h2>
<span>Active Vehicles</span>
          </div>
        </div>

        <div className="user-prof-stat-card">
<div className="user-prof-stat-icon user-prof-yellow">
  <Calendar size={26} strokeWidth={2.5} />
</div>          <div>
            <h2>
              {new Date(data.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </h2>
            <span>Joined Date</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="user-prof-card">

        <div className="user-prof-top">
          <div className="user-prof-avatar">
            {data.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-prof-name">
            <h2>{data.name}</h2>

          </div>

          <div className="user-prof-actions">
            {edit ? (
              <>
                <button className="cancel-btn" onClick={() => setEdit(false)}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="user-prof-divider"></div>

        {/* FORM OR VIEW */}
        <div className="user-prof-grid">

  {/* FULL NAME */}
  <div className="user-prof-item">
    <div className="user-prof-item-icon">
      <User size={20} strokeWidth={2.2} />
    </div>
    <div>
      <label>FULL NAME</label>
      {edit ? (
 <input
        className="user-prof-input"
        name="name"
        value={form.name}
        onChange={handleChange}
      />      ) : (
        <p>{data.name}</p>
      )}
    </div>
  </div>

  {/* EMAIL */}
  <div className="user-prof-item">
    <div className="user-prof-item-icon">
      <Mail size={20} strokeWidth={2.2} />
    </div>
    <div>
      <label>EMAIL ADDRESS</label>
      {edit ? (
        <input className="user-prof-input" name="email" value={form.email} onChange={handleChange} />
      ) : (
        <p>{data.email}</p>
      )}
    </div>
  </div>

  {/* PHONE */}
  <div className="user-prof-item">
    <div className="user-prof-item-icon">
      <Phone size={20} strokeWidth={2.2} />
    </div>
    <div>
      <label>PHONE NUMBER</label>
      {edit ? (
        <input className="user-prof-input" name="phone" value={form.phone} onChange={handleChange} />
      ) : (
        <p>{data.phone || "-"}</p>
      )}
    </div>
  </div>

  {/* ADDRESS */}
  <div className="user-prof-item">
    <div className="user-prof-item-icon">
      <MapPin size={20} strokeWidth={2.2} />
    </div>
    <div>
      <label>ADDRESS</label>
      {edit ? (
        <input
        className="user-prof-input"
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
        />
      ) : (
        <p>
          {data.address?.fullAddress}, {data.address?.city},{" "}
          {data.address?.state} - {data.address?.pincode}
        </p>
      )}
    </div>
</div>

          {edit && (
            <>
              <div>
                <label>CITY</label>
<input
  className="user-prof-input"
  name="city"
  value={form.city}
  disabled
/>              </div>

              <div>
                <label>STATE</label>
<input
  className="user-prof-input"
  name="state"
  value={form.state}
  disabled
/>              </div>

              <div>
                <label>PINCODE</label>
                <input
                className="user-prof-input"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


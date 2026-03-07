
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/addDozer.css";


const initialForm = {
  vehicleNumber: "",
  model: "",
  brand: "",
  year: "",
  expectedLifeYears: "",
  purchaseDate: "",
  status: "Active",
  driverId: "",   
  driverName: "",
  driverPhone: "",
  licenseNumber: "",
  lastServiceDate: "",
  nextServiceDate: "",
  serviceCost: "",
};

const AddDozer = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [dozers, setDozers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
// const [showForm, setShowForm] = useState(false);

    /* ===== DATE VALIDATION ===== */

const isValidDate = (dateStr) => {
  if (!dateStr) return true;

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) return false;

  const year = d.getFullYear();
  const current = new Date().getFullYear();

  return year >= 2000 && year <= current + 5;
};

  /* ================= VALIDATION ================= */

const validate = (name, value) => {
  let msg = "";

  /* ===== REQUIRED ===== */
if (!value && ["vehicleNumber", "driverName"].includes(name)) {
  msg = "Required field";
}

  /* ===== DRIVER NAME ===== */
  if (name === "driverName" && value && !/^[A-Za-z ]{2,}$/.test(value)) {
    msg = "Only letters allowed (min 2 characters)";
  }

/* ===== PHONE FORMAT ===== */
if (name === "driverPhone" && value && !/^\d{10}$/.test(value)) {
  msg = "Enter valid 10-digit phone number";
}

  /* ===== YEAR ===== */
if (name === "year" && value) {
  const current = new Date().getFullYear();
  if (value.length !== 4) msg = "Enter 4-digit year";
  else if (Number(value) > current) msg = "Year cannot be in future";
  else if (Number(value) < 1980) msg = "Year too old";
}

if (name === "expectedLifeYears" && value) {
  if (Number(value) < 1) msg = "Minimum 1 year required";
  if (Number(value) > 50) msg = "Too high";
}

if (["purchaseDate", "lastServiceDate", "nextServiceDate"].includes(name) && value) {
  if (!isValidDate(value)) {
    msg = "Invalid date";
  }
}
/* ===== SERVICE DATE CHECK ===== */
  if (name === "nextServiceDate" && value && form.lastServiceDate) {
    if (new Date(value) <= new Date(form.lastServiceDate)) {
      msg = "Next service must be after last service";
    }
  }
  
  // Next service cannot be more than 3 years ahead
  if (name === "nextServiceDate" && value) {
  const maxFuture = new Date();
  maxFuture.setFullYear(maxFuture.getFullYear() + 3);

  if (new Date(value) > maxFuture) {
    msg = "Next service date too far in future";
  }
}
  
  /* ===== SERVICE COST ===== */
if (name === "serviceCost" && value) {
  const cost = Number(value);
  if (cost < 0) msg = "Cost cannot be negative";
  else if (cost > 1000000) msg = "Cost seems too high";
}

  setErrors((prev) => ({ ...prev, [name]: msg }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    validate(name, value);
  };

  // handle driver
const handleDriverSelect = (e) => {
  const driverId = e.target.value;

  const driver = drivers.find(d => d._id === driverId);
  if (!driver) return;

  setForm(prev => ({
    ...prev,
    driverId: driver._id,   // ⭐ important
    driverName: driver.name,
    driverPhone: driver.phone,
    licenseNumber: driver.license,
    driverDOB: driver.dob
  }));
};
  /* ================= FETCH ================= */

  const fetchDozers = async () => {
    const res = await API.get("/dozers");
    setDozers(res.data);
  };

  useEffect(() => {
    fetchDozers();
  }, []);

  useEffect(() => {
  if (!id) return; // Agar Add mode hai to skip

  const fetchSingleDozer = async () => {
    try {
     const res = await API.get("/dozers");

      const d = res.data;

      setForm({
        vehicleNumber: d.vehicleNumber || "",
        model: d.model || "",
        brand: d.brand || "",
        year: d.year || "",
        expectedLifeYears: d.expectedLifeYears || "",
        purchaseDate: d.purchaseDate?.split("T")[0] || "",
        status: d.status || "Active",
        driverName: d.driverName || "",
        driverPhone: d.driverPhone || "",
        licenseNumber: d.licenseNumber || "",
        lastServiceDate: d.lastServiceDate?.split("T")[0] || "",
        nextServiceDate: d.nextServiceDate?.split("T")[0] || "",
        serviceCost: d.serviceCost || "",
      });

      setEditId(d._id);

    } catch (err) {
      console.error("Failed to fetch dozer", err);
    }
  };

  fetchSingleDozer();
}, [id]);

// driver fetch 
useEffect(() => {
  const fetchDrivers = async () => {
    try {
      const res = await API.get("/users");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    }
  };

  fetchDrivers();
}, []);

  /* ================= SUBMIT ================= */

const validateAll = () => {
  const newErrors = {};

  Object.entries(form).forEach(([key, value]) => {
    let msg = "";

    if (!value && ["vehicleNumber", "driverName"].includes(key)) {
      msg = "Required field";
    }

    if (key === "driverName" && value && !/^[A-Za-z ]{2,}$/.test(value)) {
      msg = "Only letters allowed";
    }

    if (key === "driverPhone" && value && !/^\d{10}$/.test(value)) {
      msg = "Enter valid 10-digit phone";
    }

    if (value.length === 10) {
    
    }

    if (key === "year" && value) {
      const current = new Date().getFullYear();
      if (value.length !== 4) msg = "Enter 4-digit year";
      else if (Number(value) > current) msg = "Future year not allowed";
    }

    if (["purchaseDate", "lastServiceDate", "nextServiceDate"].includes(key) && value) {
      if (!isValidDate(value)) msg = "Invalid date";
    }

    if (key === "nextServiceDate" && value && form.lastServiceDate) {
      if (new Date(value) <= new Date(form.lastServiceDate)) {
        msg = "Next service must be after last service";
      }
    }

    if (key === "serviceCost" && value) {
      const cost = Number(value);
      if (cost < 0) msg = "Invalid cost";
    }

    if (msg) newErrors[key] = msg;
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const ok = validateAll();
  if (!ok) return;

  setLoading(true);

  try {
    if (editId) {
      await API.put(`/dozers/${editId}`, form);
      toast.success("Dozer updated successfully ✅");
    } else {
      await API.post("/dozers", form);
      toast.success("Dozer saved successfully ✅");
    }

    setForm(initialForm);
    setEditId(null);

  } catch (err) {
  console.log(err.response?.data);
  toast.error(err.response?.data?.message || "Something went wrong");
}
  setLoading(false);
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dozer?")) return;
   await API.delete(`/dozers/${id}`);
    fetchDozers();
  };

  return (
    <div className="wrapper">
      {/* ===== HEADER ===== */}
<div className="add-page-header">
<button
  type="button"
  className="secondary-btn"
  onClick={() => navigate("/admin/dozer-management")}
>
  ← Back
</button>
  <h1 className="page-title"></h1>
</div>


      {/* ================= FORM ================= */}
<div className="card">
    <h2 className="title">Add New Dozer</h2>

    <form className="grid" onSubmit={handleSubmit}>

         <Field
  label="Vehicle Number"
  name="vehicleNumber"
  value={form.vehicleNumber}
  onChange={(e) => {
    const val = e.target.value.toUpperCase();
    setForm({ ...form, vehicleNumber: val });
    validate("vehicleNumber", val);
  }}
  error={errors.vehicleNumber}
/>
          <Field label="Model" name="model" value={form.model} onChange={handleChange} />

          <Field label="Brand" name="brand" value={form.brand} onChange={handleChange} />

          <Field
  label="Manufacturing Year"
  name="year"
  placeholder="YYYY"
  type="text"
  value={form.year}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4); // only 4 digits
    setForm((p) => ({ ...p, year: val }));
    validate("year", val);
  }}
  error={errors.year}
/>
<Field
  label="Expected Life (Years)"
  name="expectedLifeYears"
  type="number"
  value={form.expectedLifeYears}
  onChange={handleChange}
  min="1"
  max="50"
/>
     <Field
  label="Purchase Date"
  name="purchaseDate"
  type="date"
  value={form.purchaseDate}
  onChange={handleChange}
  min="2000-01-01"
  max={new Date().toISOString().split("T")[0]}
/>

<div className="field">
<label>Driver Name</label>

<select value={form.driverId} onChange={handleDriverSelect}>
<option value="">Select Driver</option>

{drivers.map(d => (
<option key={d._id} value={d._id}>
{d.name}
</option>
))}

</select>

</div>
<Field
label="Driver Phone"
name="driverPhone"
value={form.driverPhone}
readOnly
/>

<Field
label="License Number"
name="licenseNumber"
value={form.licenseNumber}
readOnly
/>
       <Field
  label="Last Service Date"
  name="lastServiceDate"
  type="date"
  value={form.lastServiceDate}
  onChange={handleChange}
  min="2000-01-01"
  max={new Date().toISOString().split("T")[0]}
/>
<Field
  label="Next Service Date"
  name="nextServiceDate"
  type="date"
  value={form.nextServiceDate}
  onChange={(e) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, nextServiceDate: val }));
    validate("nextServiceDate", val);
  }}
  min={form.lastServiceDate || "2000-01-01"}
  max={(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);   // max 3 years future
    return d.toISOString().split("T")[0];
  })()}
  error={errors.nextServiceDate}
/>

<Field
  label="Service Cost (₹)"
  name="serviceCost"
  type="text"
  value={form.serviceCost}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, ""); // only digits
    setForm((p) => ({ ...p, serviceCost: val }));
    validate("serviceCost", val);
  }} error={errors.serviceCost} />

                <div className="footer">
        <button disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Dozer" : "Save Dozer"}
        </button>
      </div>
    </form>
  </div>
{/* )} */}

</div>

  );
};

/* reusable inputs */

const Field = ({ label, error, ...props }) => (
  <div className="field">
    <label>{label}</label>
    <input {...props} />
    {error && <small>{error}</small>}
  </div>
);

const SelectField = ({ value, onChange }) => (
  <div className="field">
    <label>Status</label>
    <select name="status" value={value} onChange={onChange}>
      <option>Active</option>
      <option>Inactive</option>
      <option>Maintenance</option>
    </select>
  </div>
);

export default AddDozer;

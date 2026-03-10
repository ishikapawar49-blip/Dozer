import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/serviceManagement.css";

const AddService = () => {
  const navigate = useNavigate();

  const [dozers, setDozers] = useState([]);
  const [errors, setErrors] = useState({});
  const [serviceCount, setServiceCount] = useState(0);
  const { id } = useParams();

 const [form, setForm] = useState({
  dozerId: "",
  serviceType: "",
  description: "",
  serviceDate: "",
  cost: "",
});

  useEffect(() => {
    fetchDozers();
  }, []);

  useEffect(() => {
  if (!id) return;

  const fetchSingleService = async () => {
    try {
      const token = localStorage.getItem("token");

const res = await axios.get(
  `http://localhost:5000/api/services/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);


      const s = res.data;

     setForm({
  dozerId: s.dozerId?._id || "",
  serviceType: s.serviceType || "",
  description: s.description || "",
  serviceDate: s.serviceDate?.split("T")[0] || "",
  cost: s.cost || "",
});

 // ⭐ ADD THIS
    if (s.dozerId?._id) {
      fetchServiceCount(s.dozerId._id);
    }

    } catch (err) {
      console.error("Failed to fetch service");
    }
  };

  fetchSingleService();
}, [id]);

const fetchDozers = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await axios.get(
    `http://localhost:5000/api/dozers/driver/${user._id}`
  );
  setDozers([res.data]); 
};

  // fetch service count
  const fetchServiceCount = async (dozerId) => {
  if (!dozerId) {
    setServiceCount(0);
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:5000/api/services`
    );

    const filtered = res.data.filter(
      (s) => s.dozerId?._id === dozerId
    );

    setServiceCount(filtered.length);

  } catch (err) {
    console.error("Failed to fetch service count");
  }
};

/* ===== DATE VALIDATION ===== */
const isValidDate = (dateStr) => {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const year = d.getFullYear();
  const current = new Date().getFullYear();

  return (
    !isNaN(d.getTime()) &&
    year >= 2000 &&
    year <= current + 3
  );
};

/* ================= VALIDATION ================= */

const validate = (name, value) => {
  let msg = "";

  /* ===== REQUIRED ===== */
  if (
    !value &&
    ["dozerId", "serviceType","description", "serviceDate", "cost"].includes(name)
  ) {
    msg = "Required field";
  }

  /* ===== SERVICE DATE ===== */
  if (name === "serviceDate" && value) {
    if (!isValidDate(value)) {
      msg = "Invalid service date";
    }

    // If next date already selected, revalidate it
    if (
      form.nextServiceDate &&
      new Date(form.nextServiceDate) <= new Date(value)
    ) {
      setErrors((prev) => ({
        ...prev,
        nextServiceDate: "Next service must be after service date",
      }));
    }
  }

//   /* ===== NEXT SERVICE DATE ===== */
//   if (name === "nextServiceDate" && value) {
//     if (!isValidDate(value)) {
//       msg = "Invalid next service date";
//     }

//     if (
//       form.serviceDate &&
//       new Date(value) <= new Date(form.serviceDate)
//     ) {
//       msg = "Next service must be after service date";
//     }
//   }

  /* ===== COST ===== */
  if (name === "cost" && value) {
    const cost = Number(value);
    if (cost <= 0) msg = "Cost must be greater than 0";
    else if (cost > 1000000) msg = "Cost too high";
  }
  setErrors((prev) => ({ ...prev, [name]: msg }));
};

// handle change 
const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((p) => ({ ...p, [name]: value }));
  validate(name, value);

  if (name === "dozerId") {
    fetchServiceCount(value);
  }
};

// validateall
const validateAll = () => {
  const newErrors = {};

  Object.entries(form).forEach(([key, value]) => {
    let msg = "";

    if (!value) {
      msg = "Required field";
    }

    if (key === "serviceDate" && value) {
      if (!isValidDate(value)) msg = "Invalid service date";
    }

    if (key === "nextServiceDate" && value) {
      if (!isValidDate(value)) msg = "Invalid next service date";

      if (
        form.serviceDate &&
        new Date(value) <= new Date(form.serviceDate)
      ) {
        msg = "Next service must be after service date";
      }
    }

    if (key === "cost" && value) {
      const cost = Number(value);
      if (cost <= 0) msg = "Cost must be greater than 0";
      if (cost > 1000000) msg = "Cost too high";
    }

    if (msg) newErrors[key] = msg;
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
// submit
const handleSubmit = async (e) => {
  e.preventDefault();
  const ok = validateAll();
  if (!ok) return;

  try {
    if (id) {
      const token = localStorage.getItem("token");

await axios.put(
  `http://localhost:5000/api/services/${id}`,
  form,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    } else {
      const token = localStorage.getItem("token");

await axios.post(
  "http://localhost:5000/api/services",
  {
    ...form,
    serviceDate: new Date(form.serviceDate)
  }
);
    }

navigate("/user/service-management");
  } catch (err) {
    console.error("Save failed");
  }
};

// 
  return (
    <div className="svc-add-wrapper">

      <button
        className="svc-add-back-btn"
        onClick={() => navigate("/admin/service")}
      >
        ← Back
      </button>

      <div className="svc-add-card-new">
       <h2 className="svc-add-title-new">
  {id ? "Edit Service" : "Add New Service"}
</h2>

        <form className="svc-add-grid-form" onSubmit={handleSubmit}>
{/* Vehicle */}
<div className="svc-add-field">
  <label>Vehicle</label>
  <select
    name="dozerId"
    value={form.dozerId}
    onChange={handleChange}
  >
    <option value="">Select Vehicle</option>
    {dozers.map((d) => (
      <option key={d._id} value={d._id}>
        {d.vehicleNumber}
      </option>
    ))}
  </select>

  {errors.dozerId && <p className="svc-error">{errors.dozerId}</p>}

  {/* 👇 ADD THIS BLOCK HERE 👇 */}
  {form.dozerId && (
    <div className="svc-service-info">
      <p>
        Total Services Done: <strong>{serviceCount}</strong>
      </p>
      <p>
        This will be Service No: <strong>{serviceCount + 1}</strong>
      </p>
    </div>
  )}
</div>

          {/* Service Type */}
          <div className="svc-add-field">
            <label>Service Type</label>
           <select
  name="serviceType"
  value={form.serviceType}
  onChange={handleChange}
>
              <option value="">Select Service Type</option>
              <option value="Engine Service">Engine Service</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Transmission Repair">Transmission Repair</option>
              <option value="Hydraulic Check">Hydraulic Check</option>
              <option value="General Inspection">General Inspection</option>
              <option value="Breakdown Repair">Breakdown Repair</option>
            </select>
            {errors.serviceType && <p className="svc-error">{errors.serviceType}</p>}
          </div>

<div className="svc-add-field full-width">
  <label>Problem Description</label>

  <textarea
    name="description"
    value={form.description}
    placeholder="Describe the problem with the dozer..."
    rows="4"
    onChange={handleChange}
  />

</div>

          {/* Service Date */}
          <div className="svc-add-field">
            <label>Service Date</label>
            <input
  type="date"
  name="serviceDate"
  value={form.serviceDate}
  onChange={handleChange}
  min="2000-01-01"
  max={new Date().toISOString().split("T")[0]}
/>
            {errors.serviceDate && <p className="svc-error">{errors.serviceDate}</p>}
          </div>

          {/* Next Service Date
          <div className="svc-add-field">
            <label>Next Service Date</label>
            <input
  type="date"
  name="nextServiceDate"
  value={form.nextServiceDate}
  onChange={handleChange}
  min={form.serviceDate || "2000-01-01"}
  max={(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    return d.toISOString().split("T")[0];
  })()}
/>
            {errors.nextServiceDate && (
              <p className="svc-error">{errors.nextServiceDate}</p>
            )}
          </div> */}

          {/* Cost */}
          <div className="svc-add-field full-width">
            <label>Service Cost</label>
            <input
  type="text"
  name="cost"
  value={form.cost}
  placeholder="Enter service cost"
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 7);
    setForm((p) => ({ ...p, cost: val }));
    validate("cost", val);
  }}
/>
            {errors.cost && <p className="svc-error">{errors.cost}</p>}
          </div>

          <div className="svc-add-btn-group full-width">
           <button type="submit" className="svc-add-save-btn-new">
  {id ? "Update Service" : "Save Service"}
</button>

            <button
              type="button"
              className="svc-add-cancel-btn-new"
onClick={() => navigate("/user/service-management")}            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddService;
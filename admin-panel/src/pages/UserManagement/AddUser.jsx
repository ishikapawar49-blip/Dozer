import { useState,useEffect } from "react";
import API from "../../services/api";
import { useNavigate,useParams } from "react-router-dom";
import "../../styles/addDozer.css";

const initialForm = {

  name:"",
  dob:"",
  email:"",
  phone:"",
  license:""

};

const AddUser = ()=>{

  const [form,setForm] = useState(initialForm);
  const [loading,setLoading] = useState(false);
  const [errors,setErrors] = useState({});

  const {id} = useParams();
  const navigate = useNavigate();

const validateField = (name,value) => {

  let msg = "";

  if(name === "name"){
  const onlyLetters = value.replace(/[^A-Za-z ]/g,"");
  setForm(prev => ({...prev,name:onlyLetters}));
  validateField(name,onlyLetters);
  return;
}

  if(name === "dob"){
    if(!value) msg = "Date of birth required";
    else{
      const today = new Date();
      const dobDate = new Date(value);

      if(dobDate > today) msg = "Future date not allowed";
    }
  }

  if(name === "email"){
    if(!value.trim()) msg = "Email is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
      msg = "Enter valid email address";
  }

  if(name === "phone"){
    if(!value) msg = "Phone number required";
    else if(value.length !== 10)
      msg = "Phone must be 10 digits";
  }

  if(name === "license"){
    if(!value.trim())
      msg = "License number required";
  }
  setErrors(prev => ({...prev,[name]:msg}));
};

const handleChange = (e) => {
  const { name, value } = e.target;
if (!name) return;
  if(name === "phone"){
    const onlyNums = value.replace(/\D/g,"");
    if(onlyNums.length > 10) return;
    setForm(prev => ({...prev,phone:onlyNums}));
    validateField(name,onlyNums);
    return;
  }
  setForm(prev => ({...prev,[name]:value}));
  validateField(name,value);
};

  useEffect(()=>{
    if(!id) return;
    const fetchUser = async ()=>{
     const res = await API.get(`/users/${id}`);

const user = res.data;

// convert DD-MM-YYYY → YYYY-MM-DD
let formattedDOB = "";

if (user.dob) {
  const parts = user.dob.split("-");
  formattedDOB = `${parts[2]}-${parts[1]}-${parts[0]}`;
}

setForm({
  ...user,
  dob: formattedDOB
});
    }
    fetchUser();
  },[id]);


  // validations
const validateForm = () => {

  const newErrors = {};

  if(!form.name.trim())
    newErrors.name = "Name is required";

  if(!form.dob)
    newErrors.dob = "Date of birth required";

  if(!form.email.trim())
    newErrors.email = "Email required";
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
    newErrors.email = "Enter valid email";

  if(!form.phone)
    newErrors.phone = "Phone required";
  else if(form.phone.length !== 10)
    newErrors.phone = "Phone must be 10 digits";

  if(!form.license.trim())
    newErrors.license = "License required";

  setErrors(newErrors);

  if(Object.keys(newErrors).length > 0){
    alert("Please fill all the details correctly");
  }

  return Object.keys(newErrors).length === 0;
};

 const handleSubmit = async(e)=>{
  e.preventDefault();

  if(!validateForm()) return;

  setLoading(true);

    try{

      if(id){

        await API.put(`/users/${id}`,form);

      }
      else{
// convert YYYY-MM-DD → DD-MM-YYYY
const parts = form.dob.split("-");
const formattedDOB = `${parts[2]}-${parts[1]}-${parts[0]}`;

await API.post("/users", {
  name: form.name,
  email: form.email,
  phone: form.phone,
  dob: formattedDOB,
  license: form.license
});
      }

      navigate("/admin/user-management");

    }
    catch(err){

      console.log(err);

    }

    setLoading(false);

  };


  return(

    <div className="wrapper">

      <div className="add-page-header">

        <button
          className="secondary-btn"
          onClick={()=>navigate("/admin/user-management")}
        >
          ← Back
        </button>

      </div>

      <div className="card">

        <h2 className="title">Add User</h2>

        <form className="grid" onSubmit={handleSubmit}>
<Field
label="Name"
name="name"
value={form.name}
onChange={handleChange}
error={errors.name}
required
/>

          <Field
label="Date Of Birth"
name="dob"
type="date"
value={form.dob}
onChange={handleChange}
error={errors.dob}
required
/>

<Field
label="Email"
name="email"
value={form.email}
onChange={handleChange}
error={errors.email}
required
/>

<Field
label="Phone"
name="phone"
value={form.phone}
onChange={handleChange}
maxLength={10}
inputMode="numeric"
error={errors.phone}
required
/>

<Field
label="License Number"
name="license"
value={form.license}
onChange={handleChange}
error={errors.license}
required
/>

          <div className="footer">

            <button disabled={loading}>

              {loading ? "Saving..." : id ? "Update User" : "Save User"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

const Field = ({ label, name, error, ...props }) => (
  <div className="field">
    <label>{label}</label>
    <input name={name} {...props} />
    {error && <small className="error-text">{error}</small>}
  </div>
);
export default AddUser;
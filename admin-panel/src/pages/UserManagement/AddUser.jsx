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

  const {id} = useParams();
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const {name,value} = e.target;

    setForm(prev => ({...prev,[name]:value}));
  };

  useEffect(()=>{

    if(!id) return;

    const fetchUser = async ()=>{

      const res = await API.get(`/users/${id}`);

      setForm(res.data);

    }

    fetchUser();

  },[id]);


  const handleSubmit = async(e)=>{

    e.preventDefault();

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
          />

          <Field
            label="Date Of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
          />

          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Field
            label="License Number"
            name="license"
            value={form.license}
            onChange={handleChange}
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


const Field = ({label,...props})=>(
  <div className="field">
    <label>{label}</label>
    <input {...props}/>
  </div>
)

export default AddUser;
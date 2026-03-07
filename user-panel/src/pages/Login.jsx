import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
   const res = await API.post("/users/login", {
  email: email.toLowerCase().trim(),
  password: password.trim(),
});

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("dozer", JSON.stringify(res.data.dozer));
   navigate("/user/dashboard");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Owner Login 🚜</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

<input
  type="password"
  placeholder="Password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ServiceManagement from "./pages/ServiceManagement/ServiceManagement";
import AddService from "./pages/ServiceManagement/AddService";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/user/Dashboard" />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* User panel */}
        <Route path="/user" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
<Route path="service-management" element={<ServiceManagement />} />
  <Route path="service-management/add-service" element={<AddService />} />
<Route
  path="/user/service-management/add-service/:id"
  element={<AddService />}
/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
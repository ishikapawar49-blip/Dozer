import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login/Login";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import DozerManagement from "./pages/DozerManagement/DozerManagement";
import AddDozer from "./pages/DozerManagement/AddDozer";
import UserManagement from "./pages/UserManagement/UserManagement";
import AddUser from "./pages/UserManagement/AddUser";
import ServiceManagement from "./pages/ServiceManagement/ServiceManagement";

function App() {
  return (
    <BrowserRouter>
     <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* redirect root → dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        {/* ADMIN LAYOUT */}
       <Route path="/admin" element={<AdminLayout />}>

  <Route path="dozer-management" element={<DozerManagement />} />
  <Route path="dozer-management/add-dozer/:id?" element={<AddDozer />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="user-management" element={<UserManagement />} />
  <Route path="user-management/add-user" element={<AddUser />} />
  <Route path="user-management/add-user/:id" element={<AddUser />} />
  <Route path="service" element={<ServiceManagement />} />

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

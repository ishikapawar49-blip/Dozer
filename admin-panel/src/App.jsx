import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import DozerManagement from "./pages/DozerManagement/DozerManagement";
import AddDozer from "./pages/DozerManagement/AddDozer";
import ServiceManagement from "./pages/ServiceManagement/ServiceManagement";
import AddService from "./pages/ServiceManagement/AddService";

function App() {
  return (
    <BrowserRouter>
     <ToastContainer position="top-right" autoClose={2000} />

      <Routes>

        {/* redirect root → dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        {/* ADMIN LAYOUT */}
       <Route path="/admin" element={<AdminLayout />}>

  <Route path="dozer-management" element={<DozerManagement />} />
  <Route path="dozer-management/add-dozer/:id?" element={<AddDozer />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="service" element={<ServiceManagement />} />
 <Route path="service/add-service/:id?" element={<AddService />} />

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

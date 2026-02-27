import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";

// import Vehicles from "./pages/Vehicles";
// import Bookings from "./pages/Bookings";
// import Earnings from "./pages/Earnings";
// import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
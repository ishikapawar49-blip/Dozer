import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import "./styles/dashboard.css";
import "./styles/gauge.css";
import "./styles/indicators.css";
import "./styles/engineToggle.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
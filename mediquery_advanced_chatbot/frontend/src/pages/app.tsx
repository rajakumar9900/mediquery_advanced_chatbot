import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import Login from "./pages/Login";   // make sure this exists

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-report" element={<CreateReport />} />
    </Routes>
  );
}

export default App;

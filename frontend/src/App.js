import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportWaste from "./pages/ReportWaste";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportWaste />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

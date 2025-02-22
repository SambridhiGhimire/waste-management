import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportWaste from "./pages/ReportWaste";
import AdminPanel from "./pages/AdminPanel";
import WasteDetails from "./pages/WasteDetails";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgetPassword";
import EditWaste from "./pages/EditWaste";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportWaste />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/waste/:id" element={<WasteDetails />} />
          <Route path="/edit-waste/:id" element={<EditWaste />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports/user", { withCredentials: true });
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    if (user) fetchReports();
  }, [user]);

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f0f7f4] relative pt-10">
      <button className="md:hidden fixed top-14 left-5 z-50 p-1 text-2xl text-[#2e7d32]  rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      <div
        className={`w-72 bg-[#d4ede4] border-r border-[#c8e6d5] p-7 flex flex-col fixed h-screen top-0 left-0 overflow-y-auto z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col items-center mb-8 mt-12">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#c8e6d5] shadow-md" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#c8e6d5] flex items-center justify-center text-3xl font-medium text-[#2e7d32] shadow-md">{user.name.charAt(0)}</div>
          )}
          <h2 className="text-xl font-semibold text-[#1a3025] mt-4">{user.name}</h2>
          <div className="bg-[#c8e6d5] text-[#2e7d32] px-3 py-1.5 rounded-full text-sm font-semibold mt-2">{user.points} Points</div>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/report" className="text-center bg-[#2e7d32] text-white py-2 rounded-md font-medium hover:bg-[#1b5e20] transition">
            Report Waste
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className="text-center bg-[#ef4444] text-white py-2 rounded-md font-medium hover:bg-[#dc2626] transition">
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 ml-80 p-8 md:ml-0 md:p-5">
        <h1 className="text-2xl font-semibold text-[#1a3025] mb-7">Waste Management Dashboard</h1>
        <div className="grid grid-cols-3 gap-6 mb-9 md:grid-cols-2 sm:grid-cols-1">
          <StatCard value={reports.length} label="Total Reports" />
          <StatCard value={reports.filter((r) => r.status === "approved").length} label="Approved" />
          <StatCard value={reports.filter((r) => r.status === "pending").length} label="Pending" />
        </div>

        <div className="bg-[#e6f4ea] rounded-2xl p-8 shadow-sm border border-[#c8e6d5]">
          <h2 className="text-xl font-semibold text-[#1a3025] mb-7">Recent Reports</h2>
          {reports.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-gray-700 mb-5 text-lg">No reports submitted yet.</p>
              <Link to="/report" className="bg-[#2e7d32] text-white py-2 px-6 rounded-md font-medium hover:bg-[#1b5e20] transition">
                Submit Your First Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 sm:grid-cols-1">
              {reports.map((report) => (
                <ReportCard key={report._id} report={report} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="bg-[#e6f4ea] p-6 rounded-xl shadow-sm border border-[#c8e6d5] flex flex-col items-center">
    <span className="text-3xl font-semibold text-[#2e7d32] mb-2">{value}</span>
    <span className="text-sm text-[#4a5568] font-medium">{label}</span>
  </div>
);

const ReportCard = ({ report, navigate }) => (
  <div className="bg-white rounded-xl border border-[#c8e6d5] p-5 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
    <div className="flex justify-between items-center mb-4">
      <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${getStatusClass(report.status)}`}>{report.status.toUpperCase()}</span>
      <span className="text-sm text-[#2e7d32] font-semibold">{report.wasteType}</span>
    </div>
    <p className="text-sm text-[#2d3748] mb-4 leading-relaxed">{report.description}</p>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e8f5e9]">
      {report.status !== "pending" ? (
        <div className="text-sm text-[#2e7d32] font-semibold">+{report.pointsAwarded} points awarded</div>
      ) : (
        <div className="text-sm text-[#b93815] font-semibold">Awaiting Review</div>
      )}
      <button
        onClick={() => navigate(`/waste/${report._id}`)}
        className="bg-[#f1f5f9] text-[#475569] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e2e8f0] hover:text-[#1e293b] transition"
      >
        View Details
      </button>
    </div>
  </div>
);

const getStatusClass = (status) => {
  return status === "approved" ? "bg-[#e6f4ea] text-[#137333]" : status === "rejected" ? "bg-[#fce8e8] text-[#a50e0e]" : "bg-[#fff4e5] text-[#b93815]";
};

export default Dashboard;

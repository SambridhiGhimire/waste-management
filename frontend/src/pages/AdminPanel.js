import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports", { withCredentials: true });
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  const approveReport = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/reports/${id}/approve`, { points: points[id] || 0 }, { withCredentials: true });
      setReports((prevReports) => prevReports.map((report) => (report._id === id ? { ...report, status: "approved", pointsAwarded: points[id] || 0 } : report)));
      alert(res.data.message);
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const rejectReport = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/reports/${id}/reject`, {}, { withCredentials: true });
      setReports((prevReports) => prevReports.map((report) => (report._id === id ? { ...report, status: "rejected", pointsAwarded: 0 } : report)));
      alert(res.data.message);
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

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
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1a3025] mb-3">{user.name}</h2>
            <div className="bg-[#c8e6d5] text-[#2e7d32] px-3 py-1.5 rounded-full text-sm font-semibold inline-block">Admin</div>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-80 p-8 md:ml-0 md:p-5">
        <div className="mb-9">
          <h1 className="text-2xl font-semibold text-[#1a3025] mb-7">Admin Control Panel</h1>
          <div className="grid grid-cols-3 gap-6 mb-9 md:grid-cols-2 sm:grid-cols-1">
            <div className="bg-[#e6f4ea] p-6 rounded-xl shadow-sm border border-[#c8e6d5] flex flex-col items-center">
              <span className="text-3xl font-semibold text-[#2e7d32] mb-2">{reports.length}</span>
              <span className="text-sm text-[#4a5568] font-medium">Total Reports</span>
            </div>
            <div className="bg-[#e6f4ea] p-6 rounded-xl shadow-sm border border-[#c8e6d5] flex flex-col items-center">
              <span className="text-3xl font-semibold text-[#2e7d32] mb-2">{reports.filter((r) => r.status === "approved").length}</span>
              <span className="text-sm text-[#4a5568] font-medium">Approved</span>
            </div>
            <div className="bg-[#e6f4ea] p-6 rounded-xl shadow-sm border border-[#c8e6d5] flex flex-col items-center">
              <span className="text-3xl font-semibold text-[#2e7d32] mb-2">{reports.filter((r) => r.status === "pending").length}</span>
              <span className="text-sm text-[#4a5568] font-medium">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-[#e6f4ea] rounded-2xl p-8 shadow-sm border border-[#c8e6d5]">
          <h2 className="text-xl font-semibold text-[#1a3025] mb-7">Manage Reports</h2>
          {reports.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-gray-700 mb-5 text-lg">No reports to review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 sm:grid-cols-1">
              {reports.map((report) => (
                <div key={report._id} className="bg-white rounded-xl border border-[#c8e6d5] p-5 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                        report.status === "approved" ? "bg-[#e6f4ea] text-[#137333]" : report.status === "rejected" ? "bg-[#fce8e8] text-[#a50e0e]" : "bg-[#fff4e5] text-[#b93815]"
                      }`}
                    >
                      {report.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-[#2e7d32] font-semibold">{report.wasteType}</span>
                  </div>
                  <p className="text-sm text-[#2d3748] mb-4 leading-relaxed">{report.description}</p>
                  {report.status === "pending" && (
                    <div className="mb-4">
                      <input
                        type="number"
                        min="0"
                        onChange={(e) => setPoints({ ...points, [report._id]: e.target.value })}
                        placeholder="Assign points"
                        className="w-full px-3 py-2 rounded-md border border-[#c8e6d5] text-sm focus:outline-none focus:border-[#2e7d32]"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e8f5e9]">
                    {report.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveReport(report._id)}
                          className="bg-[#2e7d32] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1b5e20] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectReport(report._id)}
                          className="bg-[#ef4444] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#dc2626] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-[#2e7d32] font-semibold">+{report.pointsAwarded} points awarded</div>
                    )}
                    <button
                      onClick={() => navigate(`/waste/${report._id}`)}
                      className="bg-[#f1f5f9] text-[#475569] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e2e8f0] hover:text-[#1e293b] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

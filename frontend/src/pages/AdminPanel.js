import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState({});
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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Panel - Manage Reports</h2>
      {reports.length === 0 ? (
        <p style={styles.noReports}>No reports available.</p>
      ) : (
        <div style={styles.grid}>
          {reports.map((report) => (
            <div key={report._id} style={styles.card}>
              <p style={styles.description}>{report.description}</p>
              <p style={{ ...styles.status, ...getStatusStyle(report.status) }}>{report.status.toUpperCase()}</p>

              <p style={styles.wasteType}>
                ♻ <strong>Type:</strong> {report.wasteType}
              </p>

              <div style={styles.pointsSection}>
                {report.status !== "pending" ? (
                  <p style={styles.pointsAwarded}>🎖 {report.pointsAwarded} Points</p>
                ) : (
                  <input type="number" min="0" onChange={(e) => setPoints({ ...points, [report._id]: e.target.value })} placeholder="Assign points" style={styles.input} />
                )}
              </div>

              <div style={styles.actions}>
                {report.status === "pending" && (
                  <>
                    <button onClick={() => approveReport(report._id)} style={styles.approveBtn}>
                      ✅ Approve
                    </button>
                    <button onClick={() => rejectReport(report._id)} style={styles.rejectBtn}>
                      ❌ Reject
                    </button>
                  </>
                )}
                <button onClick={() => navigate(`/waste/${report._id}`)} style={styles.viewBtn}>
                  🔍 View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dynamic status styling
const getStatusStyle = (status) => ({
  backgroundColor: status === "approved" ? "#28a745" : status === "rejected" ? "#dc3545" : "#ffc107",
  color: "white",
  padding: "5px 10px",
  borderRadius: "5px",
  fontWeight: "bold",
});

const styles = {
  container: {
    padding: "30px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  noReports: {
    fontSize: "18px",
    color: "#666",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  description: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  status: {
    display: "inline-block",
    padding: "5px 15px",
    borderRadius: "5px",
    fontSize: "14px",
  },
  wasteType: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "8px",
  },
  pointsSection: {
    marginTop: "10px",
  },
  pointsAwarded: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "8px",
    width: "110px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  approveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.2s",
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.2s",
  },
  viewBtn: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.2s",
  },
};

export default AdminPanel;

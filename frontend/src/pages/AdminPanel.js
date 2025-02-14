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
      <h2>Admin Panel - Manage Reports</h2>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Status</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.description}</td>
                <td style={getStatusStyle(report.status)}>{report.status}</td>
                <td>
                  {report.status === "approved" ? (
                    report.pointsAwarded
                  ) : (
                    <input type="number" min="0" onChange={(e) => setPoints({ ...points, [report._id]: e.target.value })} placeholder="Assign points" />
                  )}
                </td>
                <td>
                  {report.status === "pending" && (
                    <>
                      <button onClick={() => approveReport(report._id)} style={styles.approveBtn}>
                        Approve
                      </button>
                      <button onClick={() => rejectReport(report._id)} style={styles.rejectBtn}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const getStatusStyle = (status) => ({
  color: status === "approved" ? "green" : status === "rejected" ? "red" : "orange",
  fontWeight: "bold",
});

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  approveBtn: {
    backgroundColor: "green",
    color: "white",
    marginRight: "10px",
  },
  rejectBtn: {
    backgroundColor: "red",
    color: "white",
  },
};

export default AdminPanel;

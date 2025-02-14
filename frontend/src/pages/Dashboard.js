import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
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
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.name}!</h2>
      <p>
        Your current reward points: <strong>{user.points}</strong>
      </p>

      <div style={styles.buttons}>
        <Link to="/report">
          <button style={styles.button}>Report Waste</button>
        </Link>
        {user.role === "admin" && (
          <Link to="/admin">
            <button style={styles.adminButton}>Admin Panel</button>
          </Link>
        )}
      </div>

      <h3>Your Waste Reports</h3>
      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Status</th>
              <th>Points Earned</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.description}</td>
                <td style={getStatusStyle(report.status)}>{report.status}</td>
                <td>{report.status === "approved" ? `+${report.pointsAwarded} points` : "-"}</td>
                <td>
                  <button onClick={() => navigate(`/waste/${report._id}`)} style={styles.viewBtn}>
                    View Details
                  </button>
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
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  adminButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#ddd",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #ccc",
    padding: "10px",
  },

  viewBtn: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Dashboard;

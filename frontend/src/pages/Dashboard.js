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

  console.log(user);

  return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        {user.profileImage && <img src={user.profileImage} alt="Profile" style={styles.profileImage} />}
        <h2 style={styles.heading}>Welcome, {user.name}! 🎉</h2>
      </div>

      <p style={styles.points}>
        Your current reward points: <strong>{user.points}</strong>
      </p>

      <div style={styles.buttons}>
        <Link to="/report">
          <button style={styles.button}>📍 Report Waste</button>
        </Link>
        {user.role === "admin" && (
          <Link to="/admin">
            <button style={styles.adminButton}>⚙️ Admin Panel</button>
          </Link>
        )}
      </div>

      <h3 style={styles.subheading}>Your Waste Reports</h3>
      {reports.length === 0 ? (
        <p style={styles.noReports}>No reports submitted yet.</p>
      ) : (
        <div style={styles.grid}>
          {reports.map((report) => (
            <div key={report._id} style={styles.card}>
              <p style={styles.description}>{report.description}</p>
              <p style={styles.wasteType}>
                ♻ <strong>Type:</strong> {report.wasteType}
              </p>
              <p style={{ ...styles.status, ...getStatusStyle(report.status) }}>{report.status.toUpperCase()}</p>
              <p style={styles.pointsEarned}>{report.status !== "pending" ? `🎖 +${report.pointsAwarded} points` : "⏳ Pending Review"}</p>
              <button onClick={() => navigate(`/waste/${report._id}`)} style={styles.viewBtn}>
                🔍 View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dynamic status styles
const getStatusStyle = (status) => ({
  backgroundColor: status === "approved" ? "#28a745" : status === "rejected" ? "#dc3545" : "#ffc107",
  color: "white",
  padding: "5px 10px",
  borderRadius: "5px",
  fontWeight: "bold",
});

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "2px solid #007BFF",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  points: {
    fontSize: "18px",
    color: "#333",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "0.3s",
  },
  adminButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "0.3s",
  },
  subheading: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "30px",
    color: "#444",
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
  wasteType: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "8px",
  },
  status: {
    display: "inline-block",
    padding: "5px 15px",
    borderRadius: "5px",
    fontSize: "14px",
  },
  pointsEarned: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginTop: "10px",
  },
  viewBtn: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
    fontSize: "14px",
    transition: "0.3s",
  },
};

export default Dashboard;

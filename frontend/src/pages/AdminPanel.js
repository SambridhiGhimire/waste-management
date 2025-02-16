import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      <div
        style={{
          ...styles.sidebar,
          ...(isMobileMenuOpen ? styles.sidebarMobileOpen : styles.sidebarMobileClosed),
        }}
      >
        <div style={styles.profileSection}>
          {user.profileImage ? <img src={user.profileImage} alt="Profile" style={styles.profileImage} /> : <div style={styles.profileInitial}>{user.name.charAt(0)}</div>}
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{user.name}</h2>
            <div style={styles.adminBadge}>Admin</div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.mainHeading}>Admin Control Panel</h1>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{reports.length}</span>
              <span style={styles.statLabel}>Total Reports</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{reports.filter((r) => r.status === "approved").length}</span>
              <span style={styles.statLabel}>Approved</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{reports.filter((r) => r.status === "pending").length}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
          </div>
        </div>

        <div style={styles.reportsSection}>
          <h2 style={styles.sectionHeading}>Manage Reports</h2>
          {reports.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No reports to review.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {reports.map((report) => (
                <div key={report._id} style={styles.reportCard}>
                  <div style={styles.cardHeader}>
                    <span style={{ ...styles.statusBadge, ...getStatusStyle(report.status) }}>{report.status.toUpperCase()}</span>
                    <span style={styles.wasteType}>{report.wasteType}</span>
                  </div>
                  <p style={styles.reportDescription}>{report.description}</p>
                  {report.status === "pending" && (
                    <div style={styles.pointsInput}>
                      <input type="number" min="0" onChange={(e) => setPoints({ ...points, [report._id]: e.target.value })} placeholder="Assign points" style={styles.input} />
                    </div>
                  )}
                  <div style={styles.cardFooter}>
                    {report.status === "pending" ? (
                      <div style={styles.actionButtons}>
                        <button onClick={() => approveReport(report._id)} style={styles.approveButton}>
                          Approve
                        </button>
                        <button onClick={() => rejectReport(report._id)} style={styles.rejectButton}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={styles.pointsAwarded}>+{report.pointsAwarded} points awarded</div>
                    )}
                    <button onClick={() => navigate(`/waste/${report._id}`)} style={styles.viewButton}>
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

const getStatusStyle = (status) => ({
  backgroundColor: status === "approved" ? "#e6f4ea" : status === "rejected" ? "#fce8e8" : "#fff4e5",
  color: status === "approved" ? "#137333" : status === "rejected" ? "#a50e0e" : "#b93815",
});

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f7f4", // Light green background
    position: "relative",
    paddingTop: "40px",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#d4ede4", // Light green sidebar
    borderRight: "1px solid #c8e6d5",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    top: 0,
    left: 0,
    overflowY: "auto",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
  },
  sidebarMobileOpen: {
    transform: "translateX(0)",
  },
  sidebarMobileClosed: {
    "@media (max-width: 768px)": {
      transform: "translateX(-100%)",
    },
  },
  mainContent: {
    flex: 1,
    marginLeft: "300px", // Increased from 280px to prevent overlap
    padding: "32px 40px",
    "@media (max-width: 768px)": {
      marginLeft: 0,
      padding: "20px",
    },
  },
  mobileMenuButton: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
      position: "fixed",
      top: "20px",
      left: "20px",
      zIndex: 1001,
      padding: "8px 12px",
      fontSize: "24px",
      backgroundColor: "#2e7d32",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
    marginTop: "48px",
  },
  profileImage: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "16px",
    border: "3px solid #c8e6d5",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  profileInitial: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#c8e6d5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "500",
    color: "#2e7d32",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  profileInfo: {
    textAlign: "center",
  },
  profileName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a3025",
    marginBottom: "12px",
  },
  adminBadge: {
    backgroundColor: "#c8e6d5",
    color: "#2e7d32",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-block",
  },
  header: {
    marginBottom: "36px",
  },
  mainHeading: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1a3025",
    marginBottom: "28px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "36px",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
  statCard: {
    backgroundColor: "#e6f4ea", // Light green card
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #c8e6d5",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "15px",
    color: "#4a5568",
    fontWeight: "500",
  },
  reportsSection: {
    backgroundColor: "#e6f4ea", // Light green section
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    border: "1px solid #c8e6d5",
  },
  sectionHeading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a3025",
    marginBottom: "28px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    "@media (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
  reportCard: {
    backgroundColor: "#ffffff", // White card for better contrast
    borderRadius: "12px",
    border: "1px solid #c8e6d5",
    padding: "20px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  wasteType: {
    fontSize: "14px",
    color: "#2e7d32", // Green text for waste type
    fontWeight: "600",
  },
  reportDescription: {
    fontSize: "14px",
    color: "#2d3748", // Darker text for better readability
    marginBottom: "16px",
    lineHeight: 1.6,
  },
  pointsInput: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #c8e6d5",
    fontSize: "14px",
    "&:focus": {
      outline: "none",
      borderColor: "#2e7d32",
    },
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e8f5e9",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  approveButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
  },
  rejectButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#dc2626",
    },
  },
  viewButton: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e2e8f0",
      color: "#1e293b",
    },
  },
  pointsAwarded: {
    fontSize: "14px",
    color: "#2e7d32",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
  },
  emptyStateText: {
    color: "#4a5568",
    marginBottom: "20px",
    fontSize: "16px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "16px",
    color: "#4a5568",
  },
};

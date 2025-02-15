import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      {/* Mobile Menu Button */}
      <button style={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      {/* Sidebar */}
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
            <div style={styles.pointsBadge}>
              <span style={styles.pointsValue}>{user.points}</span>
              <span style={styles.pointsLabel}>Points</span>
            </div>
          </div>
        </div>

        <div style={styles.sidebarButtons}>
          <Link to="/report" style={styles.linkReset}>
            <button style={styles.primaryButton}>Report Waste</button>
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" style={styles.linkReset}>
              <button style={styles.secondaryButton}>Admin Panel</button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.mainHeading}>Waste Management Dashboard</h1>
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
          <h2 style={styles.sectionHeading}>Recent Reports</h2>
          {reports.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No reports submitted yet.</p>
              <Link to="/report" style={styles.linkReset}>
                <button style={styles.startButton}>Submit Your First Report</button>
              </Link>
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
                  <div style={styles.cardFooter}>
                    {report.status !== "pending" ? (
                      <div style={styles.pointsAwarded}>+{report.pointsAwarded} points awarded</div>
                    ) : (
                      <div style={styles.pendingLabel}>Awaiting Review</div>
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

const getStatusStyle = (status) => ({
  backgroundColor: status === "approved" ? "#e6f4ea" : status === "rejected" ? "#fce8e8" : "#fff4e5",
  color: status === "approved" ? "#137333" : status === "rejected" ? "#a50e0e" : "#b93815",
});

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafb",
    position: "relative",
    paddingTop: "40px",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "white",
    borderRight: "1px solid #e1e5ea",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    "@media (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafb",
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
    border: "3px solid #e8f5e9",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  profileInitial: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#e8f5e9",
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
  pointsBadge: {
    backgroundColor: "#e8f5e9",
    padding: "10px 20px",
    borderRadius: "20px",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  pointsValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2e7d32",
  },
  pointsLabel: {
    fontSize: "13px",
    color: "#2e7d32",
    fontWeight: "500",
  },
  sidebarButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "24px",
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
  statCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #e8f5e9",
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
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e8f5e9",
  },
  sectionHeading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a3025",
    marginBottom: "28px",
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e8f5e9",
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
    color: "#4a5568",
    fontWeight: "500",
  },
  reportDescription: {
    fontSize: "14px",
    color: "#2d3748",
    marginBottom: "16px",
    lineHeight: 1.6,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e8f5e9",
  },
  pointsAwarded: {
    fontSize: "14px",
    color: "#2e7d32",
    fontWeight: "600",
  },
  pendingLabel: {
    fontSize: "14px",
    color: "#b93815",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    width: "100%",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    boxShadow: "0 2px 4px rgba(46, 125, 50, 0.2)",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
  },
  secondaryButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    width: "100%",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
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
  linkReset: {
    textDecoration: "none",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "16px",
    color: "#4a5568",
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
  startButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    boxShadow: "0 2px 4px rgba(46, 125, 50, 0.2)",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
  },
};

export default Dashboard;

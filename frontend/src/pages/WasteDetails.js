import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const WasteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/detail/${id}`, { withCredentials: true });
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching report:", error);
        alert("Report not found.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const approveReport = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/reports/${id}/approve`, { points }, { withCredentials: true });
      alert(res.data.message);
      setReport({ ...report, status: "approved", pointsAwarded: points, approvedBy: user });
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const rejectReport = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/reports/${id}/reject`, {}, { withCredentials: true });
      alert(res.data.message);
      setReport({ ...report, status: "rejected", approvedBy: user });
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.wasteDetailsContainer}>
      <div style={styles.wasteDetailsCard}>
        <h1 style={styles.wasteDetailsTitle}>Waste Report Details</h1>

        {report ? (
          <>
            {/* Top Section: Image and Details Side by Side */}
            <div style={styles.topSection}>
              <div style={styles.wasteImageContainer}>
                <img src={`http://localhost:5000/${report.imagePath}`} alt="Waste" style={styles.wasteImage} />
              </div>

              <div style={styles.wasteInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Description:</span>
                  <span style={styles.infoValue}>{report.description}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Waste Type:</span>
                  <span style={styles.infoValue}>{report.wasteType}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Status:</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(report.status === "approved" ? styles.statusApproved : report.status === "rejected" ? styles.statusRejected : styles.statusPending),
                    }}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Reported by:</span>
                  <span style={styles.infoValue}>
                    {report.user.name} ({report.user.email})
                  </span>
                </div>
                {report.status !== "pending" && report.approvedBy && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Approved/Rejected by:</span>
                    <span style={styles.infoValue}>
                      {report.approvedBy.name} ({report.approvedBy.email})
                    </span>
                  </div>
                )}
                {report.status === "approved" && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Points Awarded:</span>
                    <span style={styles.infoValue}>{report.pointsAwarded}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Horizontal Map */}
            <div style={styles.bottomSection}>
              <h2 style={styles.locationTitle}>Waste Location</h2>
              <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} style={styles.map}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.location.lat, report.location.lng]} icon={markerIcon} />
              </MapContainer>
            </div>

            {/* Admin Actions */}
            {user && user.role === "admin" && report.status === "pending" && (
              <div style={styles.adminActions}>
                <input type="number" placeholder="Assign points" min="0" onChange={(e) => setPoints(e.target.value)} style={styles.pointsInput} />
                <button onClick={approveReport} style={{ ...styles.actionButton, ...styles.approveButton }}>
                  Approve
                </button>
                <button onClick={rejectReport} style={{ ...styles.actionButton, ...styles.rejectButton }}>
                  Reject
                </button>
              </div>
            )}
          </>
        ) : (
          <p style={styles.errorMessage}>Report not found.</p>
        )}
      </div>
    </div>
  );
};

export default WasteDetails;
const styles = {
  wasteDetailsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#e6f4ea", // Updated to match ReportWaste
    padding: "20px",
    marginTop: "50px",
  },
  wasteDetailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "1200px",
    width: "100%",
    padding: "30px",
  },
  wasteDetailsTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a3025", // Updated to match ReportWaste
    marginBottom: "20px",
    textAlign: "center",
  },
  topSection: {
    display: "flex",
    gap: "30px",
    marginBottom: "30px",
  },
  wasteImageContainer: {
    flex: 1,
    borderRadius: "12px",
    overflow: "hidden",
  },
  wasteImage: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
  },
  wasteInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoLabel: {
    fontWeight: "500",
    color: "#4a5568", // Updated to match ReportWaste
  },
  infoValue: {
    color: "#1a3025", // Updated to match ReportWaste
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
  },
  statusApproved: {
    backgroundColor: "#2e7d32", // Updated to match ReportWaste
  },
  statusRejected: {
    backgroundColor: "#d32f2f", // Updated to match ReportWaste
  },
  statusPending: {
    backgroundColor: "#e65100", // Updated to match ReportWaste
  },
  bottomSection: {
    width: "100%",
  },
  locationTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a3025", // Updated to match ReportWaste
    marginBottom: "10px",
  },
  map: {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
  },
  adminActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  pointsInput: {
    padding: "10px",
    border: "1px solid #c8e6d5", // Updated to match ReportWaste
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  },
  actionButton: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.3s",
    color: "white",
  },
  approveButton: {
    backgroundColor: "#2e7d32", // Updated to match ReportWaste
  },
  approveButtonHover: {
    backgroundColor: "#1b5e20", // Updated to match ReportWaste
  },
  rejectButton: {
    backgroundColor: "#d32f2f", // Updated to match ReportWaste
  },
  rejectButtonHover: {
    backgroundColor: "#b71c1c", // Updated to match ReportWaste
  },
  errorMessage: {
    textAlign: "center",
    color: "#d32f2f", // Updated to match ReportWaste
    fontSize: "18px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#4a5568", // Updated to match ReportWaste
  },
  "@media (max-width: 768px)": {
    topSection: {
      flexDirection: "column",
    },
    wasteDetailsCard: {
      padding: "20px",
    },
    wasteDetailsTitle: {
      fontSize: "22px",
    },
    map: {
      height: "250px",
    },
  },
};

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Marker Issue
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📍 Waste Report Details</h2>
      {report ? (
        <div style={styles.card}>
          <img src={`http://localhost:5000/${report.imagePath}`} alt="Waste" style={styles.image} />

          <div style={styles.info}>
            <p>
              <strong>📖 Description:</strong> {report.description}
            </p>
            <p>
              <strong>📌 Status:</strong> <span style={getStatusStyle(report.status)}>{report.status.toUpperCase()}</span>
            </p>
            <p>
              <strong>👤 Reported by:</strong> {report.user.name} ({report.user.email})
            </p>

            {report.status !== "pending" && report.approvedBy && (
              <p>
                <strong>✅ Approved/Rejected by:</strong> {report.approvedBy.name} ({report.approvedBy.email})
              </p>
            )}

            {report.status === "approved" && (
              <p>
                <strong>🎖 Points Awarded:</strong> {report.pointsAwarded}
              </p>
            )}
          </div>

          <p style={styles.mapText}>🗺 Waste Location:</p>
          <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} style={styles.map}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[report.location.lat, report.location.lng]} icon={markerIcon} />
          </MapContainer>

          {user && user.role === "admin" && report.status === "pending" && (
            <div style={styles.adminActions}>
              <input type="number" placeholder="Assign points" min="0" onChange={(e) => setPoints(e.target.value)} style={styles.input} />
              <button onClick={approveReport} style={styles.approveBtn}>
                ✅ Approve
              </button>
              <button onClick={rejectReport} style={styles.rejectBtn}>
                ❌ Reject
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Report not found.</p>
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
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  info: {
    textAlign: "left",
    padding: "10px 0",
  },
  mapText: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
    color: "#444",
  },
  map: {
    width: "100%",
    height: "300px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  adminActions: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    width: "120px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  approveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "14px",
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "14px",
  },
};

export default WasteDetails;

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
  console.log(report.imagePath);

  return (
    <div style={styles.container}>
      <h2>Waste Report Details</h2>
      {report ? (
        <>
          <img src={`http://localhost:5000/${report.imagePath}`} alt="Waste" style={styles.image} />
          <p>
            <strong>Description:</strong> {report.description}
          </p>
          <p>
            <strong>Status:</strong> <span style={getStatusStyle(report.status)}>{report.status}</span>
          </p>
          <p>
            <strong>Reported by:</strong> {report.user.name} ({report.user.email})
          </p>

          {report.status !== "pending" && report.approvedBy && (
            <p>
              <strong>Approved/Rejected by:</strong> {report.approvedBy.name} ({report.approvedBy.email})
            </p>
          )}

          {report.status === "approved" && (
            <p>
              <strong>Points Awarded:</strong> {report.pointsAwarded}
            </p>
          )}

          <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} style={styles.map}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[report.location.lat, report.location.lng]} icon={markerIcon} />
          </MapContainer>

          {user && user.role === "admin" && report.status === "pending" && (
            <div style={styles.adminActions}>
              <input type="number" placeholder="Enter points" min="0" onChange={(e) => setPoints(e.target.value)} style={styles.input} />
              <button onClick={approveReport} style={styles.approveBtn}>
                Approve
              </button>
              <button onClick={rejectReport} style={styles.rejectBtn}>
                Reject
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Report not found.</p>
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
  image: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "10px",
    margin: "10px 0",
  },
  map: {
    width: "100%",
    height: "400px",
    maxWidth: "600px",
    margin: "20px 0",
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
    width: "100px",
    textAlign: "center",
  },
  approveBtn: {
    backgroundColor: "green",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  rejectBtn: {
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default WasteDetails;

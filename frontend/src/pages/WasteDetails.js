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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="waste-details-container">
      <div className="waste-details-card">
        <h1 className="waste-details-title">Waste Report Details</h1>

        {report ? (
          <>
            {/* Top Section: Image and Details Side by Side */}
            <div className="top-section">
              <div className="waste-image-container">
                <img src={`http://localhost:5000/${report.imagePath}`} alt="Waste" className="waste-image" />
              </div>

              <div className="waste-info">
                <div className="info-item">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{report.description}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Waste Type:</span>
                  <span className="info-value">{report.wasteType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`status-badge ${report.status}`}>{report.status.toUpperCase()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Reported by:</span>
                  <span className="info-value">
                    {report.user.name} ({report.user.email})
                  </span>
                </div>
                {report.status !== "pending" && report.approvedBy && (
                  <div className="info-item">
                    <span className="info-label">Approved/Rejected by:</span>
                    <span className="info-value">
                      {report.approvedBy.name} ({report.approvedBy.email})
                    </span>
                  </div>
                )}
                {report.status === "approved" && (
                  <div className="info-item">
                    <span className="info-label">Points Awarded:</span>
                    <span className="info-value">{report.pointsAwarded}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Horizontal Map */}
            <div className="bottom-section">
              <h2 className="location-title">Waste Location</h2>
              <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} className="map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.location.lat, report.location.lng]} icon={markerIcon} />
              </MapContainer>
            </div>

            {/* Admin Actions */}
            {user && user.role === "admin" && report.status === "pending" && (
              <div className="admin-actions">
                <input type="number" placeholder="Assign points" min="0" onChange={(e) => setPoints(e.target.value)} className="points-input" />
                <button onClick={approveReport} className="action-button approve-button">
                  Approve
                </button>
                <button onClick={rejectReport} className="action-button reject-button">
                  Reject
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="error-message">Report not found.</p>
        )}
      </div>
    </div>
  );
};

export default WasteDetails;

const styles = `
  .waste-details-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f4f8;
    padding: 20px;
  }

  .waste-details-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    width: 100%;
    padding: 30px;
  }

  .waste-details-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 20px;
    text-align: center;
  }

  .top-section {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
  }

  .waste-image-container {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
  }

  .waste-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .waste-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-label {
    font-weight: 500;
    color: #4a5568;
  }

  .info-value {
    color: #2d3748;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
  }

  .status-badge.approved {
    background-color: #38a169;
  }

  .status-badge.rejected {
    background-color: #e53e3e;
  }

  .status-badge.pending {
    background-color: #dd6b20;
  }

  .bottom-section {
    width: 100%;
  }

  .location-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 10px;
  }

  .map {
    width: 100%;
    height: 300px;
    border-radius: 12px;
  }

  .admin-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .points-input {
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
  }

  .action-button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .approve-button {
    background-color: #38a169;
    color: #ffffff;
  }

  .approve-button:hover {
    background-color: #2f8559;
  }

  .reject-button {
    background-color: #e53e3e;
    color: #ffffff;
  }

  .reject-button:hover {
    background-color: #c53030;
  }

  .error-message {
    text-align: center;
    color: #e53e3e;
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    .top-section {
      flex-direction: column;
    }

    .waste-details-card {
      padding: 20px;
    }

    .waste-details-title {
      font-size: 1.75rem;
    }

    .map {
      height: 250px;
    }
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

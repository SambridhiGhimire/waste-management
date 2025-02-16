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

  if (loading) return <div className="text-center text-lg text-gray-700">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e6f4ea] p-6 mt-12">
      <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full p-8">
        <h1 className="text-2xl font-bold text-[#1a3025] text-center mb-6">Waste Report Details</h1>
        {report ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <img src={`http://localhost:5000/${report.imagePath}`} alt="Waste" className="w-full h-auto rounded-lg" />
              </div>
              <div className="flex-1 space-y-4">
                <InfoItem label="Description" value={report.description} />
                <InfoItem label="Waste Type" value={report.wasteType} />
                <InfoItem label="Status" value={report.status.toUpperCase()} status={report.status} />
                <InfoItem label="Reported by" value={`${report.user.name} (${report.user.email})`} />
                {report.status !== "pending" && report.approvedBy && <InfoItem label="Approved/Rejected by" value={`${report.approvedBy.name} (${report.approvedBy.email})`} />}
                {report.status === "approved" && <InfoItem label="Points Awarded" value={report.pointsAwarded} />}
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-lg font-semibold text-[#1a3025] mb-3">Waste Location</h2>
              <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} className="w-full h-72 rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.location.lat, report.location.lng]} icon={markerIcon} />
              </MapContainer>
            </div>

            {user && user.role === "admin" && report.status === "pending" && (
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <input type="number" placeholder="Assign points" min="0" onChange={(e) => setPoints(e.target.value)} className="p-3 border border-[#c8e6d5] rounded-md" />
                <button onClick={approveReport} className="px-4 py-3 bg-[#2e7d32] text-white rounded-md font-medium hover:bg-[#1b5e20] transition">
                  Approve
                </button>
                <button onClick={rejectReport} className="px-4 py-3 bg-[#d32f2f] text-white rounded-md font-medium hover:bg-[#b71c1c] transition">
                  Reject
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-red-500 text-lg">Report not found.</p>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, status }) => {
  let statusColor = "text-gray-700";
  if (status === "approved") statusColor = "text-green-600";
  if (status === "rejected") statusColor = "text-red-600";
  if (status === "pending") statusColor = "text-orange-600";

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className={`font-semibold ${status ? statusColor : "text-[#1a3025]"}`}>{value}</span>
    </div>
  );
};

export default WasteDetails;

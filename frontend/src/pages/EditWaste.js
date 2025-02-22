import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const wasteTypes = ["E-waste", "Paper waste", "Metal waste", "Plastic waste", "Stationary waste", "Organic waste", "Others"];

const markerIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const EditWaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/detail/${id}`, { withCredentials: true });
        console.log(res.data);

        setDescription(res.data.description);
        setWasteType(res.data.wasteType);
        setLocation(res.data.location);
        setPreview(`http://localhost:5000/${res.data.imagePath}`);
      } catch (error) {
        console.error("Error fetching report:", error);
        alert("Report not found.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("wasteType", wasteType);
    formData.append("location", JSON.stringify(location));
    if (image) formData.append("image", image);

    try {
      await axios.put(`http://localhost:5000/api/reports/${id}/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Report updated successfully!");
      navigate(`/waste/${id}`);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component to allow users to click and change location
  const LocationPicker = () => {
    useMapEvents({
      click: (e) => {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    return null;
  };

  if (loading) return <div className="text-center text-lg text-gray-700">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-[#e6f4ea] rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#1a3025] mb-4">Edit Waste Report</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Describe the waste issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-3 border border-[#c8e6d5] rounded-md"
        />

        <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} required className="p-3 border border-[#c8e6d5] rounded-md">
          <option value="">Select Waste Type</option>
          {wasteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="fileUpload" className="py-2 px-4 bg-[#2e7d32] text-white text-center rounded-md cursor-pointer">
          Upload a New Image
        </label>
        <input type="file" id="fileUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
        {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded-md mt-2" />}

        <p className="text-gray-700 text-sm font-semibold">Click on the map to change location</p>
        <MapContainer center={location} zoom={12} className="w-full h-72 rounded-md">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location} icon={markerIcon} />
          <LocationPicker />
        </MapContainer>

        <button type="submit" disabled={isSubmitting} className="py-3 bg-[#2e7d32] text-white rounded-md font-medium hover:bg-[#1b5e20] transition">
          {isSubmitting ? "Updating..." : "Update Report"}
        </button>
      </form>
    </div>
  );
};

export default EditWaste;

import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const wasteTypes = ["E-waste", "Paper waste", "Metal waste", "Plastic waste", "Stationary waste", "Organic waste", "Others"];

const ReportWaste = () => {
  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markerIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return <Marker position={location} icon={markerIcon} />;
  };

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
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/reports/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Waste report submitted successfully!");
      setDescription("");
      setWasteType("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error submitting waste report:", error.response?.data || error.message);
      alert("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-[#e6f4ea] rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#1a3025] mb-4">Report Waste</h2>
      <p className="text-gray-700 mb-6">Help keep the environment clean by reporting waste in your area.</p>

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
          Upload an Image
        </label>
        <input type="file" id="fileUpload" accept="image/*" onChange={handleImageChange} required className="hidden" />
        {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded-md mt-2" />}

        <p className="text-sm text-gray-600">Click on the map to pinpoint the waste location.</p>
        <MapContainer center={location} zoom={12} className="w-full h-72 rounded-md">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>

        <button type="submit" disabled={isSubmitting} className="py-3 bg-[#2e7d32] text-white rounded-md font-medium hover:bg-[#1b5e20] transition">
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportWaste;

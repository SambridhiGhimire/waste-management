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
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 }); // Default: Kathmandu
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Report Waste</h2>
      <p style={styles.subtext}>Help keep the environment clean by reporting waste in your area.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Describe the waste issue..." value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.input} />

        <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} required style={styles.input}>
          <option value="">Select Waste Type</option>
          {wasteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="fileUpload" style={styles.fileLabel}>
          Upload an Image
        </label>
        <input type="file" id="fileUpload" accept="image/*" onChange={handleImageChange} required style={styles.fileInput} />

        {preview && <img src={preview} alt="Preview" style={styles.preview} />}

        <p style={styles.mapInstructions}>Click on the map to pinpoint waste location.</p>
        <MapContainer center={location} zoom={12} style={styles.map}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>

        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a3025",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  fileLabel: {
    padding: "10px 15px",
    backgroundColor: "#2e7d32",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  preview: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginTop: "10px",
  },
  mapInstructions: {
    fontSize: "14px",
    color: "#666",
  },
  map: {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default ReportWaste;

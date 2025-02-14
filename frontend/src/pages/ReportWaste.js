import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ReportWaste = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 }); // Default: Kathmandu
  const [isSubmitting, setIsSubmitting] = useState(false);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return <Marker position={location} />;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", JSON.stringify(location));
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/reports/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Waste report submitted successfully!");
    } catch (error) {
      console.error("Error submitting waste report:", error.response?.data || error.message);
      alert("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Report Waste</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Description of the waste" value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.input} />

        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={styles.input} />

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
    padding: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    width: "100%",
    maxWidth: "400px",
  },
  map: {
    width: "100%",
    height: "400px",
    maxWidth: "600px",
    margin: "20px 0",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default ReportWaste;

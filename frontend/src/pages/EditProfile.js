import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage ? `http://localhost:5000${user.profileImage}` : null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Live preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/edit-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setUser(res.data.user);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f7f4] p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Your Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <label htmlFor="fileUpload" className="cursor-pointer">
            {preview ? (
              <img src={preview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md hover:opacity-80 transition" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#c8e6d5] flex items-center justify-center text-3xl font-medium text-[#2e7d32] shadow-md">{user.name.charAt(0)}</div>
            )}
          </label>
          <input type="file" id="fileUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
          <p className="text-sm text-gray-500 mt-2">Click to upload a new profile picture</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

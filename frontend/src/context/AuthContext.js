import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user info when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.log("Not logged in.");
      }
    };
    fetchUser();
  }, []);

  // Google Login Function
  const loginWithGoogle = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {}, { withCredentials: true });
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return <AuthContext.Provider value={{ user, setUser, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
};

import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        console.log("Not logged in.");
      }
    };
    fetchUser();
  }, []);

  // Redirect to backend Google login
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // Logout Function
  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return <AuthContext.Provider value={{ user, setUser, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
};

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loginWithGoogle } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div style={styles.container}>
      <h2>Login to Waste Management System</h2>
      <p>Track, report, and manage waste responsibly.</p>
      <button onClick={loginWithGoogle} style={styles.googleBtn}>
        Login with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
  },
  googleBtn: {
    marginTop: "20px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Login;

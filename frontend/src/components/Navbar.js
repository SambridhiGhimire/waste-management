import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        Waste Management
      </Link>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/report" style={styles.link}>
              Report Waste
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" style={styles.link}>
                Admin Panel
              </Link>
            )}
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/" style={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;

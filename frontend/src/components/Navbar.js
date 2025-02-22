import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <img
          style={{
            width: 35,
            height: 35,
            borderRadius: 99999,
          }}
          src={logo}
          alt="logo"
        />
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
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: "1001",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#d4ede4",
    color: "black",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "black",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;

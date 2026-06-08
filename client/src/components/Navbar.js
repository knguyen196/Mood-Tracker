import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Mood Tracker</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/log">Log Mood</Link>
        <Link to="/history">History</Link>
        <Link to="/variables">Variables</Link>
        <Link to="/insights">Insights</Link>
      </div>
      <div className="navbar-user">
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <span>Hey, {user?.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

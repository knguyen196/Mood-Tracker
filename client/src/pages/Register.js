import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../api";

const checkPassword = (password) => ({
  length: password.length >= 8,
  letter: /[a-zA-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^a-zA-Z0-9]/.test(password),
});

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const rules = checkPassword(password);
  const allValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allValid) {
      setError("Password does not meet all requirements");
      return;
    }

    try {
      await api.post("/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Mood Tracker</h1>
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {password && (
            <ul className="password-rules">
              <li className={rules.length ? "valid" : ""}>
                At least 8 characters
              </li>
              <li className={rules.letter ? "valid" : ""}>
                At least one letter
              </li>
              <li className={rules.number ? "valid" : ""}>
                At least one number
              </li>
              <li className={rules.special ? "valid" : ""}>
                At least one special character
              </li>
            </ul>
          )}

          <button type="submit">Create Account</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

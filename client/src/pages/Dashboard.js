import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get("/entries");
        setEntries(res.data);
      } catch (err) {
        setError("Failed to load entries");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) return <div>Loading...</div>;

  const averageMood =
    entries.length > 0
      ? (
          entries.reduce((sum, entry) => sum + entry.moodScore, 0) /
          entries.length
        ).toFixed(1)
      : null;

  const chartData = [...entries].reverse().map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    mood: entry.moodScore,
  }));

  const recentEntries = entries.slice(0, 5);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      {error && <div className="error">{error}</div>}
      {entries.length === 0 ? (
        <div>
          <p>No entries yet. Start tracking your mood.</p>
          <Link to="/log">Log your first mood</Link>
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="stat-card">
              <h3>Average Mood</h3>
              <p>{averageMood}</p>
            </div>
            <div className="stat-card">
              <h3>Total Entries</h3>
              <p>{entries.length}</p>
            </div>
          </div>

          <div className="chart">
            <h3>Mood Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#5e99dd" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="recent">
            <h3>Recent Entries</h3>
            {recentEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <span>{new Date(entry.loggedAt).toLocaleDateString()}</span>
                <span>Mood: {entry.moodScore}/10</span>
                {entry.notes && <p>{entry.notes}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

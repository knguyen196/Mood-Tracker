import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const History = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/entries/${id}`);
      fetchEntries();
    } catch (err) {
      setError("Failed to delete entry");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="history-page">
      <h1>History</h1>

      {error && <p className="error">{error}</p>}

      {entries.length === 0 ? (
        <div>
          <p>No entries yet.</p>
          <Link to="/log">Log your first mood</Link>
        </div>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <div key={entry.id} className="history-card">
              <div className="history-header">
                <span>{new Date(entry.loggedAt).toLocaleString()}</span>
                <span>Mood: {entry.moodScore}/10</span>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </div>

              {entry.contextLogs.length > 0 && (
                <div className="history-context">
                  {entry.contextLogs.map((log) => (
                    <span key={log.id}>
                      {log.variable.name}: {log.value}
                      {log.variable.unit ? ` ${log.variable.unit}` : ""}
                    </span>
                  ))}
                </div>
              )}

              {entry.notes && <p className="history-notes">{entry.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

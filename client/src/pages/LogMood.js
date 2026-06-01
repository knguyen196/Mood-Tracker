import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const LogMood = () => {
  const [variables, setVariables] = useState([]);
  const [moodScore, setMoodScore] = useState(5);
  const [notes, setNotes] = useState("");
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const res = await api.get("/variables");
        setVariables(res.data);
      } catch (err) {
        setError("Failed to load variables");
      } finally {
        setLoading(false);
      }
    };
    fetchVariables();
  }, []);

  const handleValueChange = (variableId, value) => {
    setValues((prev) => ({ ...prev, [variableId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const contextLogs = Object.entries(values)
      .filter(([, value]) => value !== "" && value !== undefined)
      .map(([variableId, value]) => ({
        variableId: parseInt(variableId),
        value,
      }));

    try {
      await api.post("/entries", {
        moodScore: parseInt(moodScore),
        notes,
        contextLogs,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const renderInput = (variable) => {
    const value = values[variable.id] ?? "";

    if (variable.type === "boolean") {
      return (
        <select
          value={value}
          onChange={(e) => handleValueChange(variable.id, e.target.value)}
        >
          <option value="">--</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );
    }

    if (variable.type === "scale") {
      return (
        <input
          type="range"
          min="1"
          max="10"
          value={value || 5}
          onChange={(e) => handleValueChange(variable.id, e.target.value)}
        />
      );
    }

    if (variable.type === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleValueChange(variable.id, e.target.value)}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleValueChange(variable.id, e.target.value)}
      />
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="log-mood-page">
      <h1>Log Your Mood</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Mood ({moodScore}/10)
          <div className="slider-with-labels">
            <span>Awful</span>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(e.target.value)}
            />
            <span>Great</span>
          </div>
        </label>

        {variables.map((variable) => (
          <label key={variable.id}>
            {variable.name}
            {variable.unit ? ` (${variable.unit})` : ""}
            {renderInput(variable)}
          </label>
        ))}

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything worth remembering about today?"
          />
        </label>

        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
};

export default LogMood;

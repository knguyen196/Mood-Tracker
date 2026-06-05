import { useState, useEffect } from "react";
import api from "../api";

const Variables = () => {
  const [variables, setVariables] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVariables = async () => {
    try {
      const res = await api.get("/variables");
      setVariables(res.data);
    } catch (err) {
      setError("Failed to fetch variables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/variables", { name, type, unit });
      setName("");
      setType("number");
      setUnit("");
      fetchVariables();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/variables/${id}`);
      fetchVariables();
    } catch (err) {
      setError("Failed to delete variable");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page">
      <h1>Variables</h1>
      <p>Define the factors you want to track alongside your mood.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="variable-form">
        <input
          type="text"
          placeholder="Name (e.g. Sleep, Exercise, Caffeine)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="number">Number</option>
          <option value="boolean">Yes/No</option>
          <option value="scale">Scale (1-10)</option>
          <option value="text">Text</option>
        </select>
        <input
          type="text"
          placeholder="Unit (e.g. hours, cups, etc.)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button type="submit">Add Variable</button>
      </form>

      <div className="variable-list">
        {variables.length === 0 ? (
          <p>No variables defined yet. Start by adding one above.</p>
        ) : (
          variables.map((variable) => (
            <div key={variable.id} className="variable-item">
              <span>
                {variable.name}
                {variable.unit ? `, ${variable.unit}` : ""}
              </span>
              <button onClick={() => handleDelete(variable.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Variables;

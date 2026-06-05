import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const MIN_PER_SIDE = 3;

const Insights = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
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

  const average = (nums) => nums.reduce((sum, n) => sum + n, 0) / nums.length;

  const median = (nums) => {
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  const computeInsights = () => {
    const variableMap = {};

    entries.forEach((entry) => {
      entry.contextLogs.forEach((log) => {
        const v = log.variable;
        if (v.type === "text") return;

        if (!variableMap[v.id]) {
          variableMap[v.id] = { variable: v, points: [] };
        }
        variableMap[v.id].points.push({
          value: log.value,
          mood: entry.moodScore,
        });
      });
    });

    const results = [];

    Object.values(variableMap).forEach(({ variable, points }) => {
      let highMoods = [];
      let lowMoods = [];
      let highLabel = "";
      let lowLabel = "";

      if (variable.type === "boolean") {
        highMoods = points.filter((p) => p.value === "yes").map((p) => p.mood);
        lowMoods = points.filter((p) => p.value === "no").map((p) => p.mood);
        highLabel = "Yes";
        lowLabel = "No";
      } else {
        const numericPoints = points
          .map((p) => ({ value: parseFloat(p.value), mood: p.mood }))
          .filter((p) => !isNaN(p.value));

        if (numericPoints.length === 0) return;

        const med = median(numericPoints.map((p) => p.value));

        highMoods = numericPoints
          .filter((p) => p.value >= med)
          .map((p) => p.mood);
        lowMoods = numericPoints
          .filter((p) => p.value < med)
          .map((p) => p.mood);
        highLabel = `${med}${variable.unit ? " " + variable.unit : ""} or more`;
        lowLabel = `Below ${med}${variable.unit ? " " + variable.unit : ""}`;
      }

      if (highMoods.length < MIN_PER_SIDE || lowMoods.length < MIN_PER_SIDE) {
        return;
      }

      const highAvg = average(highMoods);
      const lowAvg = average(lowMoods);

      results.push({
        name: variable.name,
        highLabel,
        lowLabel,
        highAvg: highAvg.toFixed(1),
        lowAvg: lowAvg.toFixed(1),
        difference: (highAvg - lowAvg).toFixed(1),
      });
    });

    return results.sort(
      (a, b) => Math.abs(b.difference) - Math.abs(a.difference),
    );
  };

  if (loading) return <p>Loading...</p>;

  const insights = computeInsights();

  return (
    <div className="insight-page">
      <h1>Insights</h1>
      <p>How your tracked factors relate to your mood.</p>

      {error && <p className="error">{error}</p>}

      {entries.length < 10 ? (
        <div className="entry-card">
          <p>
            Log at least 10 entries to start seeing insights. You have{" "}
            {entries.length} so far.
          </p>
          <Link to="/log">Log a mood</Link>
        </div>
      ) : insights.length === 0 ? (
        <div className="entry-card">
          <p>
            Not enough data per variable yet. Keep logging and insights will
            appear as patterns emerge.
          </p>
        </div>
      ) : (
        <div className="insights-list">
          {insights.map((insight) => (
            <div key={insight.name} className="insight-card">
              <h3>{insight.name}</h3>
              <div className="insight-compare">
                <div>
                  <span className="insight-label">{insight.highLabel}</span>
                  <span className="insight-mood">{insight.highAvg}/10</span>
                </div>
                <div>
                  <span className="insight-label">{insight.lowLabel}</span>
                  <span className="insight-mood">{insight.lowAvg}/10</span>
                </div>
              </div>
              <p className="insight-summary">
                {insight.difference > 0
                  ? `Your mood is ${insight.difference} points higher on "${insight.highLabel}" days.`
                  : insight.difference < 0
                    ? `Your mood is ${Math.abs(
                        insight.difference,
                      )} points lower on "${insight.highLabel}" days.`
                    : `No difference in mood for this factor.`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const contextVariableRoutes = require("./routes/contextVariables");
const moondEntryRoutes = require("./routes/moodEntries");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/variables", contextVariableRoutes);
app.use("/api/entries", moondEntryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Mood Tracker API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

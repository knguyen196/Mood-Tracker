const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const contextVariableRoutes = require("./routes/contextVariables");
const moodEntryRoutes = require("./routes/moodEntries");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/variables", contextVariableRoutes);
app.use("/api/entries", moodEntryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Mood Tracker API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});

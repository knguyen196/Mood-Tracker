const express = require("express");
const authenticate = require("../middleware/auth");

const {
  getEntries,
  createEntry,
  deleteEntry,
} = require("../controllers/moodEntries");

const router = express.Router();

router.use(authenticate);

router.get("/", getEntries);
router.post("/", createEntry);
router.delete("/:id", deleteEntry);

module.exports = router;

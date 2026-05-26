const express = require("express");
const authenticate = require("../middleware/auth");

const {
  getVariables,
  createVariable,
  deleteVariable,
} = require("../controllers/contextVariables");

const router = express.Router();

router.use(authenticate);

router.get("/", getVariables);
router.post("/", createVariable);
router.delete("/:id", deleteVariable);

module.exports = router;

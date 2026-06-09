const express = require("express");
const rateLimit = require("express-rate-limit");
const authenticate = require("../middleware/auth");
const {
  register,
  login,
  me,
  logout,
  deleteAccount,
} = require("../controllers/auth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authenticate, me);
router.post("/logout", logout);
router.delete("/account", authenticate, deleteAccount);

module.exports = router;

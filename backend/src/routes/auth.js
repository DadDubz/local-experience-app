const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const authMiddleware = require("../middleware/authMiddleware");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, preferences } = req.body;
    const result = await AuthService.registerUser({
      email,
      password,
      name,
      preferences,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: "Registration failed",
      message: error.message,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({
      error: "Login failed",
      message: error.message,
    });
  }
});

// Get user licenses
router.get("/licenses", authMiddleware.verifyToken, async (req, res) => {
  try {
    const licenses = await AuthService.getUserLicenses(req.user.id);
    res.json(licenses);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch licenses",
      message: error.message,
    });
  }
});

module.exports = router;

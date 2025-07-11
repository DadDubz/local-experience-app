const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// 🧠 Register Route with Validation
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  authController.registerUser
);

// 🧠 Login Route with Validation
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.loginUser
);

// 🧠 Get Licenses (Protected)
router.get("/licenses", authMiddleware, authController.getUserLicenses);

module.exports = router;

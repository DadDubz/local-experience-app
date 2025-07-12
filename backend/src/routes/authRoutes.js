// src/routes/authRoutes.js
import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getUserLicenses,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name").notEmpty().withMessage("Name is required"),
];

const loginValidation = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/licenses", authMiddleware, getUserLicenses);

export default router;

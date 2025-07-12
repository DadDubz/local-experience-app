// backend/src/routes/authRoutes.js

import express from "express";
import authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import ErrorHandler from "../middleware/errorHandler.js";

const router = express.Router();

// Register a new user
router.post("/register", authController.registerUser);

// Login
router.post("/login", authController.loginUser);

// Get licenses (protected route)
router.get("/licenses", authMiddleware, authController.getLicenses);

// Fallback for unmatched auth routes
router.all("*", (req, res) => {
  ErrorHandler.handleNotFound(req, res);
});

export default router;

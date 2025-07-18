// === backend/src/routes/authRoutes.js ===
import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 8+ characters").isLength({ min: 8 }),
  ],
  registerUser
);

router.post(
  "/login",
  [
    check("email", "A valid email is required").isEmail(),
    check("password", "Password is required").notEmpty()
  ],
  loginUser
);

export default router;

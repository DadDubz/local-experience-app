import express from "express";
import { registerUser, loginUser, getUserLicenses } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/licenses", authMiddleware, getUserLicenses);

export default router;

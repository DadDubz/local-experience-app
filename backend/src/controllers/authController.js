// === backend/src/controllers/authController.js ===
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorHandler from "../middleware/errorHandler.js";

export const registerUser = async (req, res, next) => {
  console.log("✅ Register route hit");
  console.log("Request body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.VALIDATION_ERROR,
        errors.array().map(err => err.msg).join(", ")
      )
    );
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Attempt to register with existing email:", email);
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.DUPLICATE_EMAIL,
          "Email already in use",
          409
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    if (!process.env.JWT_SECRET) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.SERVER_ERROR,
          "JWT secret is not defined",
          500
        )
      );
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DATABASE_ERROR,
        "User registration failed"
      )
    );
  }
};

export const loginUser = async (req, res, next) => {
  console.log("✅ Login route hit");
  console.log("Credentials received:", { email: req.body.email });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.VALIDATION_ERROR,
        errors.array().map(err => err.msg).join(", ")
      )
    );
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ Login failed: email not found", email);
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
          "Invalid email or password",
          401
        )
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Login failed: password mismatch for", email);
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
          "Invalid email or password",
          401
        )
      );
    }

    if (!process.env.JWT_SECRET) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.SERVER_ERROR,
          "JWT secret is not defined",
          500
        )
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DATABASE_ERROR,
        "User login failed"
      )
    );
  }
};

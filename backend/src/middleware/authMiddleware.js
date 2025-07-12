// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      ErrorHandler.handleAuthorizationError("Authorization token missing")
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(
      ErrorHandler.handleAuthorizationError("Invalid or expired token")
    );
  }
};

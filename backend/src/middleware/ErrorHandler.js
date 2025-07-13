// src/middleware/errorHandler.js

export const errorTypes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  MISSING_FIELDS: "MISSING_FIELDS",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
  WEAK_PASSWORD: "WEAK_PASSWORD",
  DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  DATABASE_ERROR: "DATABASE_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

function handleCustom(type, message, statusCode = 400) {
  const error = new Error(message);
  error.type = type;
  error.statusCode = statusCode;
  return error;
}

function handleAuthorizationError(message) {
  const error = new Error(message || "Unauthorized");
  error.type = errorTypes.AUTHORIZATION_ERROR;
  error.statusCode = 401;
  return error;
}

function handleNotFound(req, res, next) {
  const error = new Error(`🔍 Not Found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function handleError(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    errorType: err.type || errorTypes.UNKNOWN_ERROR,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default {
  errorTypes,
  handleCustom,
  handleAuthorizationError,
  handleNotFound,
  handleError,
};

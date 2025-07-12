// src/middleware/errorHandler.js
class ErrorHandler {
  static errorTypes = {
    MISSING_FIELDS: "MISSING_FIELDS",
    INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
    WEAK_PASSWORD: "WEAK_PASSWORD",
    DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    NOT_FOUND: "NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
  };

  static handleCustom(type, message, statusCode = 400) {
    const err = new Error(message);
    err.type = type;
    err.statusCode = statusCode;
    return err;
  }

  static handleNotFound(req, res, next) {
    const err = new Error("Route not found");
    err.statusCode = 404;
    next(err);
  }

  static handleError(err, req, res, next) {
    console.error("🔴", err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
      type: err.type || "SERVER_ERROR",
    });
  }

  static handleAuthorizationError(message = "Unauthorized") {
    const err = new Error(message);
    err.type = this.errorTypes.UNAUTHORIZED;
    err.statusCode = 401;
    return err;
  }
}

export default ErrorHandler;

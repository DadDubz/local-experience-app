const { logger } = require("./logger");

class ErrorHandler {
  static errorTypes = {
    VALIDATION_ERROR: "ValidationError",
    RESOURCE_NOT_FOUND: "ResourceNotFound",
    AUTHORIZATION_ERROR: "AuthorizationError",
    AUTHENTICATION_ERROR: "AuthenticationError",
    DUPLICATE_EMAIL: "DuplicateEmailError",
    INVALID_EMAIL_FORMAT: "InvalidEmailFormat",
    WEAK_PASSWORD: "WeakPasswordError",
    MISSING_FIELDS: "MissingFieldsError",
    USER_NOT_FOUND: "UserNotFoundError",
    API_ERROR: "APIError",
    DATABASE_ERROR: "DatabaseError",
    NETWORK_ERROR: "NetworkError",
    FILE_UPLOAD_ERROR: "FileUploadError",
    RATE_LIMIT_ERROR: "RateLimitError",
  };

  static handleError(err, req, res, next) {
    const errorType = err.type || "UnhandledError";
    let status = err.status || 500;
    let message = err.message || "Something went wrong.";
    let userGuidance = "Please try again later or contact support.";

    switch (errorType) {
      case ErrorHandler.errorTypes.VALIDATION_ERROR:
        status = 400;
        userGuidance = "Please check your input and try again.";
        break;

      case ErrorHandler.errorTypes.MISSING_FIELDS:
        status = 400;
        userGuidance = "All required fields must be filled.";
        break;

      case ErrorHandler.errorTypes.INVALID_EMAIL_FORMAT:
        status = 400;
        userGuidance = "Please enter a valid email address.";
        break;

      case ErrorHandler.errorTypes.WEAK_PASSWORD:
        status = 400;
        userGuidance = "Password must meet minimum strength requirements.";
        break;

      case ErrorHandler.errorTypes.DUPLICATE_EMAIL:
        status = 409;
        userGuidance = "That email is already registered. Try logging in instead.";
        break;

      case ErrorHandler.errorTypes.USER_NOT_FOUND:
        status = 404;
        userGuidance = "No user found with that email address.";
        break;

      case ErrorHandler.errorTypes.AUTHENTICATION_ERROR:
        status = 401;
        userGuidance = "Incorrect email or password. Please try again.";
        break;

      case ErrorHandler.errorTypes.RESOURCE_NOT_FOUND:
        status = 404;
        userGuidance = "The resource you’re looking for could not be found.";
        break;

      case ErrorHandler.errorTypes.AUTHORIZATION_ERROR:
        status = 403;
        userGuidance = "You are not authorized to perform this action.";
        break;

      case ErrorHandler.errorTypes.API_ERROR:
        status = 503;
        userGuidance = "Service is temporarily unavailable. Please try again later.";
        break;

      case ErrorHandler.errorTypes.DATABASE_ERROR:
        status = 503;
        userGuidance = "We’re experiencing server issues. Please try again later.";
        break;

      case ErrorHandler.errorTypes.NETWORK_ERROR:
        status = 504;
        userGuidance = "Network issue detected. Please check your connection.";
        break;

      case ErrorHandler.errorTypes.FILE_UPLOAD_ERROR:
        status = 422;
        userGuidance = "File upload failed. Please check the format and size.";
        break;

      case ErrorHandler.errorTypes.RATE_LIMIT_ERROR:
        status = 429;
        userGuidance = "Too many requests. Please wait and try again.";
        break;

      default:
        status = status;
        userGuidance = "An unexpected error occurred. Please try again.";
        break;
    }

    const errorResponse = {
      success: false,
      error: {
        type: errorType,
        message,
        guidance: userGuidance,
        status,
        timestamp: new Date().toISOString(),
        path: req?.path || "unknown",
        method: req?.method || "unknown",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
    };

    ErrorHandler.logError(err, req);
    res.status(status).json(errorResponse);
  }

  static handleNotFound(req, res, next) {
    const err = new Error("Resource not found");
    err.type = ErrorHandler.errorTypes.RESOURCE_NOT_FOUND;
    err.status = 404;
    next(err);
  }

  static handleValidationError(message = "Validation failed") {
    const err = new Error(message);
    err.type = ErrorHandler.errorTypes.VALIDATION_ERROR;
    err.status = 400;
    return err;
  }

  static handleCustom(type, message = "", status = 400) {
    const err = new Error(message);
    err.type = type;
    err.status = status;
    return err;
  }

  static handleRateLimit(req, res) {
    res.status(429).json({
      success: false,
      error: {
        type: ErrorHandler.errorTypes.RATE_LIMIT_ERROR,
        message: "Too many requests",
        guidance: "Please wait a moment and try again.",
        status: 429,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static logError(error, req) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: error?.type || "UnknownError",
      message: error?.message || "No message",
      status: error?.status || 500,
      path: req?.path || "unknown",
      method: req?.method || "unknown",
      ip: req?.ip || "unknown",
      user: req?.user?.id || "anonymous",
      headers: req?.headers,
      query: req?.query,
      body: req?.body,
      stack: error?.stack,
    };

    if (process.env.NODE_ENV === "development") {
      console.error("[Error Log]", JSON.stringify(logData, null, 2));
    }

    if (logger && logger.error) {
      logger.error(logData);
    }
  }
}

module.exports = ErrorHandler;

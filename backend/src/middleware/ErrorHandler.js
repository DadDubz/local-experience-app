// src/middleware/errorhandler.js

const { logger } = require("./logger");

class ErrorHandler {
  static errorTypes = {
    VALIDATION_ERROR: "ValidationError",
    RESOURCE_NOT_FOUND: "ResourceNotFound",
    AUTHORIZATION_ERROR: "AuthorizationError",
    API_ERROR: "APIError",
    DATABASE_ERROR: "DatabaseError",
    NETWORK_ERROR: "NetworkError",
    BUSINESS_ERROR: "BusinessError",
    FILE_UPLOAD_ERROR: "FileUploadError",
    RATE_LIMIT_ERROR: "RateLimitError",
  };

  /**
   * Main error handler
   */
  static handleError(err, req, res, next) {
    const errorType = err.type || "UnhandledError";
    let status = err.status || 500;
    let message = err.message || "Something went wrong.";
    let userGuidance = "Please try again later or contact support.";

    // Custom messages and guidance
    switch (errorType) {
      case ErrorHandler.errorTypes.VALIDATION_ERROR:
        status = 400;
        userGuidance = "Please check your input and try again.";
        break;

      case ErrorHandler.errorTypes.RESOURCE_NOT_FOUND:
        status = 404;
        userGuidance = "The resource you’re looking for could not be found.";
        break;

      case ErrorHandler.errorTypes.AUTHORIZATION_ERROR:
        status = 401;
        userGuidance = "You are not authorized. Please log in and try again.";
        break;

      case ErrorHandler.errorTypes.API_ERROR:
        status = 503;
        userGuidance = "Our external services are currently unavailable. Try again shortly.";
        break;

      case ErrorHandler.errorTypes.DATABASE_ERROR:
        status = 503;
        userGuidance = "We’re experiencing server issues. Please try again later.";
        break;

      case ErrorHandler.errorTypes.NETWORK_ERROR:
        status = 504;
        userGuidance = "Network issue detected. Please check your connection and try again.";
        break;

      case ErrorHandler.errorTypes.FILE_UPLOAD_ERROR:
        status = 422;
        userGuidance = "There was a problem uploading your file. Please check the format and size.";
        break;

      case ErrorHandler.errorTypes.RATE_LIMIT_ERROR:
        status = 429;
        userGuidance = "You’re sending too many requests. Please wait and try again.";
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

  static handleAPIError(message = "External API error", originalError = null) {
    const err = new Error(message);
    err.type = ErrorHandler.errorTypes.API_ERROR;
    err.originalError = originalError;
    err.status = 503;
    return err;
  }

  static handleDatabaseError(message = "Database operation failed", originalError = null) {
    const err = new Error(message);
    err.type = ErrorHandler.errorTypes.DATABASE_ERROR;
    err.originalError = originalError;
    err.status = 503;
    return err;
  }

  static handleNetworkError(message = "Network issue", originalError = null) {
    const err = new Error(message);
    err.type = ErrorHandler.errorTypes.NETWORK_ERROR;
    err.originalError = originalError;
    err.status = 504;
    return err;
  }

  static handleFileUploadError(message = "File upload failed", originalError = null) {
    const err = new Error(message);
    err.type = ErrorHandler.errorTypes.FILE_UPLOAD_ERROR;
    err.originalError = originalError;
    err.status = 422;
    return err;
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

  static async handleRecovery(error, retryCount = 3) {
    if (retryCount <= 0) throw error;

    switch (error.type) {
      case ErrorHandler.errorTypes.DATABASE_ERROR:
      case ErrorHandler.errorTypes.NETWORK_ERROR:
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.handleRecovery(error, retryCount - 1);
      default:
        throw error;
    }
  }
}

module.exports = ErrorHandler;

// Error handling middleware class
class ErrorHandler {
  // Custom error types
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

  // Main error handling middleware
  static handleError(err, req, res, next) {
    const error = {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    };

    // Add stack trace in development environment
    if (process.env.NODE_ENV === "development") {
      error.stack = err.stack;
    }

    // Log error for monitoring
    this.logError(err, req);

    // Handle specific error types
    switch (err.type) {
      case ErrorHandler.errorTypes.VALIDATION_ERROR:
        error.status = 400;
        break;
      case ErrorHandler.errorTypes.RESOURCE_NOT_FOUND:
        error.status = 404;
        break;
      case ErrorHandler.errorTypes.AUTHORIZATION_ERROR:
        error.status = 401;
        break;
      case ErrorHandler.errorTypes.API_ERROR:
        error.status = 503;
        break;
      case ErrorHandler.errorTypes.DATABASE_ERROR:
        error.status = 503;
        break;
      case ErrorHandler.errorTypes.NETWORK_ERROR:
        error.status = 504;
        break;
      case ErrorHandler.errorTypes.FILE_UPLOAD_ERROR:
        error.status = 422;
        break;
      case ErrorHandler.errorTypes.RATE_LIMIT_ERROR:
        error.status = 429;
        break;
    }

    res.status(error.status).json(this.formatErrorResponse(error));
  }

  // Not Found error handler
  static handleNotFound(req, res, next) {
    const err = new Error("Resource not found");
    err.type = ErrorHandler.errorTypes.RESOURCE_NOT_FOUND;
    next(err);
  }

  // Validation error handler
  static handleValidationError(message) {
    const err = new Error(message || "Validation failed");
    err.type = ErrorHandler.errorTypes.VALIDATION_ERROR;
    return err;
  }

  // Rate limiting error handler
  static handleRateLimit(req, res) {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please try again later",
      timestamp: new Date().toISOString(),
    });
  }

  // API error handler
  static handleAPIError(message, originalError = null) {
    const err = new Error(message || "External API error");
    err.type = ErrorHandler.errorTypes.API_ERROR;
    err.originalError = originalError;
    return err;
  }

  // Database error handler
  static handleDatabaseError(message, originalError = null) {
    const err = new Error(message || "Database operation failed");
    err.type = ErrorHandler.errorTypes.DATABASE_ERROR;
    err.originalError = originalError;
    return err;
  }

  // Network error handler
  static handleNetworkError(message, originalError = null) {
    const err = new Error(message || "Network operation failed");
    err.type = ErrorHandler.errorTypes.NETWORK_ERROR;
    err.originalError = originalError;
    return err;
  }

  // File upload error handler
  static handleFileUploadError(message, originalError = null) {
    const err = new Error(message || "File upload failed");
    err.type = ErrorHandler.errorTypes.FILE_UPLOAD_ERROR;
    err.originalError = originalError;
    return err;
  }

  // Format error response
  static formatErrorResponse(error) {
    return {
      success: false,
      error: {
        type: error.type,
        message: error.message,
        status: error.status,
        timestamp: new Date().toISOString(),
        code: error.code || "UNKNOWN_ERROR",
        details: error.details || null,
        path: error.path,
        method: error.method,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
    };
  }

  // Enhanced error logging
  static logError(error, req) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: error.type,
      message: error.message,
      status: error.status,
      path: req.path,
      method: req.method,
      ip: req.ip,
      user: req.user ? req.user.id : "anonymous",
      headers: req.headers,
      query: req.query,
      body: req.body,
      stack: error.stack,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Log]", JSON.stringify(errorLog, null, 2));
    }

    // Add any external logging service here
    // Example: sendToLoggingService(errorLog);
  }

  // Recovery strategies
  static async handleRecovery(error, retryCount = 3) {
    if (retryCount === 0) {
      throw error;
    }

    switch (error.type) {
      case ErrorHandler.errorTypes.DATABASE_ERROR:
        // Wait and retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.handleRecovery(error, retryCount - 1);

      case ErrorHandler.errorTypes.NETWORK_ERROR:
        // Implement circuit breaker pattern
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return this.handleRecovery(error, retryCount - 1);

      default:
        throw error;
    }
  }
}

module.exports = ErrorHandler;
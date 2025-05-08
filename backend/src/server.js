// src/server.js
require('./instrument');
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");
const fileUpload = require("express-fileupload");
const compression = require("compression");
const morgan = require("morgan");

const WebSocketService = require("./services/websocketService");
const ErrorHandler = require("./middleware/errorhandler");
const { logger, morganMiddleware } = require("./middleware/logger");
const securityMiddleware = require("./middleware/security");
const { redis } = require("./middleware/cache"); // redis instance from ioredis
const monitoringMiddleware = require("./middleware/monitor");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
new WebSocketService(server);

// Middleware
app.use(helmet());
app.use(securityMiddleware.cors);
app.use(securityMiddleware.customSecurity);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
}));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(compression());
app.use(morgan("dev"));
app.use(morganMiddleware);

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true,
}));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Monitoring
app.use(monitoringMiddleware.responseTime);
app.use(monitoringMiddleware.trackRequests);

// Redis Ping Check
redis.ping()
  .then((res) => {
    if (res === 'PONG') console.log("✅ Redis connected and ready");
  })
  .catch((err) => {
    console.error("❌ Redis connection failed:", err);
  });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("error", err => logger.error("MongoDB error:", err));
mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/lands", require("./routes/lands"));
app.use("/api/guides", require("./routes/guides"));
app.use("/api/shops", require("./routes/shops"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/reports", require("./routes/reports"));

// Health & Docs
app.get("/metrics", monitoringMiddleware.metricsEndpoint);
app.get("/health", monitoringMiddleware.healthCheck);
app.get("/api-docs", (req, res) =>
  res.sendFile(path.join(__dirname, "../docs", "api-documentation.html"))
);

// Error Handling
app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

// Graceful Shutdown
process.on("unhandledRejection", err => logger.error("Unhandled Rejection:", err));
process.on("uncaughtException", err => {
  logger.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  server.close(() =>
    mongoose.connection.close(false, () => process.exit(0))
  );
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});

module.exports = server;
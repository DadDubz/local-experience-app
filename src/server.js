const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const morgan = require('morgan');
const WebSocketService = require('./services/websocketService');
const ErrorHandler = require('./middleware/ErrorHandler');
const { logger, morganMiddleware } = require('./middleware/logger');
const securityMiddleware = require('./middleware/security');
const cacheMiddleware = require('./middleware/cache');
const monitoringMiddleware = require('./middleware/monitor');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wsService = new WebSocketService(server);

// Security middleware
app.use(helmet());
app.use(securityMiddleware.cors);
app.use(securityMiddleware.customSecurity);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(morganMiddleware);

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    abortOnLimit: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Monitoring
app.use(monitoringMiddleware.responseTime);
app.use(monitoringMiddleware.trackRequests);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Handle database events
mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
    logger.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    logger.warn('MongoDB disconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/reports', require('./routes/reports'));

// Metrics endpoint
app.get('/metrics', monitoringMiddleware.metricsEndpoint);

// Health check route
app.get('/health', monitoringMiddleware.healthCheck);

// API documentation route
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'api-documentation.html'));
});

// Error handling middleware
app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    logger.error('Unhandled Promise Rejection:', err);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logger.error('Uncaught Exception:', err);
    // Gracefully shutdown
    server.close(() => {
        process.exit(1);
    });
});

// SIGTERM handler
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    logger.info('SIGTERM received');
    // Gracefully shutdown
    server.close(() => {
        mongoose.connection.close(false, () => {
            process.exit(0);
        });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    logger.info(`Server started on port ${PORT}`);
});

module.exports = server; // For testing purposes

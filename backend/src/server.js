// src/server.js
import './instrument.js';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fileUpload from 'express-fileupload';
import compression from 'compression';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import landsRoutes from './routes/lands.js';
import guidesRoutes from './routes/guides.js';
import shopsRoutes from './routes/shops.js';
import weatherRoutes from './routes/weather.js';
import reportsRoutes from './routes/reports.js';

import WebSocketService from './services/websocketService.js';
import ErrorHandler from './middleware/errorHandler.js';
import { logger, morganMiddleware } from './middleware/logger.js';
import securityMiddleware from './middleware/security.js';
import monitoringMiddleware from './middleware/monitor.js';
import { getRedisClient } from './middleware/redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);

// Redis connection
const initRedis = async () => {
  try {
    const redis = await getRedisClient();
    const pong = await redis.ping();
    if (pong === 'PONG') console.log('✅ Redis connected and ready');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
};
initRedis();

// Middleware
app.use(helmet());
app.use(securityMiddleware.cors);
app.use(securityMiddleware.customSecurity);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());
app.use(morgan('dev'));
app.use(morganMiddleware);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true,
}));

// Static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Monitoring
app.use(monitoringMiddleware.responseTime);
app.use(monitoringMiddleware.trackRequests);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landsRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/reports', reportsRoutes);

// WebSocket
new WebSocketService(server);

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', err => logger.error('MongoDB error:', err));
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

// Monitoring Routes
app.get('/metrics', monitoringMiddleware.metricsEndpoint);
app.get('/api-docs', (_, res) => {
  res.sendFile(path.join(__dirname, '../docs', 'api-documentation.html'));
});

// Error Handling
app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

// Server Events
process.on('unhandledRejection', err => logger.error('Unhandled Rejection:', err));
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => mongoose.connection.close(false, () => process.exit(0)));
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});

export default server;

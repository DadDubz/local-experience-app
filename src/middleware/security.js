const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const securityMiddleware = {
    // Basic security headers
    helmet: helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                scriptSrc: ["'self'"],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: { policy: "cross-origin" },
        dnsPrefetchControl: true,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true
    }),

    // CORS configuration
    cors: cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 600 // 10 minutes
    }),

    // Sanitize data
    mongoSanitize: mongoSanitize(),

    // Prevent XSS attacks
    xss: xss(),

    // Prevent HTTP Parameter Pollution
    hpp: hpp({
        whitelist: [
            'coordinates',
            'date',
            'type',
            'category',
            'rating',
            'price'
        ]
    }),

    // Custom security middleware
    customSecurity: (req, res, next) => {
        // Remove sensitive headers
        res.removeHeader('X-Powered-By');
        
        // Add security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        
        // Prevent client-side caching of authenticated requests
        if (req.headers.authorization) {
            res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }

        next();
    }
};

module.exports = securityMiddleware;
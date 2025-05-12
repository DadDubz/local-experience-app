const promClient = require('prom-client');
const responseTime = require('response-time');

// Initialize metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotalCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const errorsTotalCounter = new promClient.Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type']
});

const monitoringMiddleware = {
    // Track response time
    responseTime: responseTime((req, res, time) => {
        if (req.route) {
            httpRequestDurationMicroseconds
                .labels(req.method, req.route.path, res.statusCode)
                .observe(time / 1000); // Convert to seconds
        }
    }),

    // Track requests
    trackRequests: (req, res, next) => {
        res.on('finish', () => {
            if (req.route) {
                httpRequestsTotalCounter
                    .labels(req.method, req.route.path, res.statusCode)
                    .inc();
            }
        });
        next();
    },

    // Error tracking
    trackErrors: (error, req, res, next) => {
        errorsTotalCounter.labels(error.name || 'unknown').inc();
        next(error);
    },

    // Metrics endpoint
    metricsEndpoint: async (req, res) => {
        try {
            res.set('Content-Type', promClient.register.contentType);
            const metrics = await promClient.register.metrics();
            res.send(metrics);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Health check endpoint
    healthCheck: (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    }
};

module.exports = monitoringMiddleware;
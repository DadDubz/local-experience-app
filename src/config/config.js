// src/config/config.js
module.exports = {
    cache: {
        ttl: process.env.CACHE_TTL || 3600,
        checkPeriod: process.env.CACHE_CHECK_PERIOD || 600
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    },
    db: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/local-experience'
    },
    api: {
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 100
        }
    }
};
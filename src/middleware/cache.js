const Redis = require('ioredis');
const config = require('../config/config');

// Initialize Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: times => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

const cacheMiddleware = {
    // Standard cache middleware
    cache: (duration = 3600) => {
        return async (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }

            const key = `cache:${req.originalUrl}`;

            try {
                const cachedData = await redis.get(key);
                if (cachedData) {
                    return res.json(JSON.parse(cachedData));
                }

                // Modify response to store cache
                const originalJson = res.json;
                res.json = function(data) {
                    redis.setex(key, duration, JSON.stringify(data));
                    originalJson.call(this, data);
                };

                next();
            } catch (error) {
                console.error('Cache error:', error);
                next();
            }
        };
    },

    // Clear cache by pattern
    clearCache: pattern => {
        return async (req, res, next) => {
            try {
                const keys = await redis.keys(`cache:${pattern}`);
                if (keys.length > 0) {
                    await redis.del(keys);
                }
                next();
            } catch (error) {
                console.error('Cache clear error:', error);
                next();
            }
        };
    },

    // Cache specific data
    cacheData: async (key, data, duration = 3600) => {
        try {
            await redis.setex(`cache:${key}`, duration, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    },

    // Get cached data
    getCachedData: async (key) => {
        try {
            const data = await redis.get(`cache:${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }
};

module.exports = cacheMiddleware;
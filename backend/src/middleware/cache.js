// src/middleware/cache.js
const Redis = require("ioredis");
const config = require("../config/config");

// Initialize Redis client with enhanced error handling
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
});

// Monitor Redis connection
redis.on('error', (error) => {
  console.error('Redis Error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

const CACHE_TYPES = {
  WEATHER: 'weather',
  TRAILS: 'trails',
  FISHING: 'fishing',
  GUIDES: 'guides',
  USER: 'user'
};

const cacheMiddleware = {
  // Enhanced cache middleware with type-specific durations
  cache: (type = null, customDuration = null) => {
    return async (req, res, next) => {
      if (req.method !== "GET") {
        return next();
      }

      // Set cache duration based on data type
      let duration = customDuration;
      if (!duration) {
        switch (type) {
          case CACHE_TYPES.WEATHER:
            duration = 1800; // 30 minutes for weather
            break;
          case CACHE_TYPES.TRAILS:
            duration = 86400; // 24 hours for trails
            break;
          case CACHE_TYPES.FISHING:
            duration = 3600; // 1 hour for fishing spots
            break;
          case CACHE_TYPES.GUIDES:
            duration = 43200; // 12 hours for guides
            break;
          case CACHE_TYPES.USER:
            duration = 300; // 5 minutes for user data
            break;
          default:
            duration = 3600; // 1 hour default
        }
      }

      const key = `cache:${type}:${req.originalUrl}`;

      try {
        const cachedData = await redis.get(key);
        if (cachedData) {
          // Add cache hit monitoring
          await redis.hincrby('cache:metrics', 'hits', 1);
          return res.json(JSON.parse(cachedData));
        }

        // Add cache miss monitoring
        await redis.hincrby('cache:metrics', 'misses', 1);

        // Modify response to store cache
        const originalJson = res.json;
        res.json = function (data) {
          // Don't cache error responses
          if (res.statusCode === 200) {
            redis.setex(key, duration, JSON.stringify(data));
          }
          originalJson.call(this, data);
        };

        next();
      } catch (error) {
        console.error("Cache error:", error);
        next();
      }
    };
  },

  // Clear cache with more specific patterns
  clearCache: (type = null, pattern = '*') => {
    return async (req, res, next) => {
      try {
        const searchPattern = type ? 
          `cache:${type}:${pattern}` : 
          `cache:${pattern}`;

        const keys = await redis.keys(searchPattern);
        if (keys.length > 0) {
          await redis.del(keys);
          console.log(`Cleared ${keys.length} cache entries for pattern: ${searchPattern}`);
        }
        next();
      } catch (error) {
        console.error("Cache clear error:", error);
        next();
      }
    };
  },

  // Batch cache operations
  batchCacheData: async (items) => {
    try {
      const pipeline = redis.pipeline();
      
      items.forEach(({ key, data, duration = 3600, type = null }) => {
        const cacheKey = type ? `cache:${type}:${key}` : `cache:${key}`;
        pipeline.setex(cacheKey, duration, JSON.stringify(data));
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Batch cache error:", error);
      return false;
    }
  },

  // Get multiple cached items
  getBatchCachedData: async (keys, type = null) => {
    try {
      const cacheKeys = keys.map(key => 
        type ? `cache:${type}:${key}` : `cache:${key}`
      );
      
      const results = await redis.mget(cacheKeys);
      return results.map(item => item ? JSON.parse(item) : null);
    } catch (error) {
      console.error("Batch cache get error:", error);
      return keys.map(() => null);
    }
  },

  // Cache with geospatial support
  cacheGeoData: async (key, longitude, latitude, data, duration = 3600) => {
    try {
      const pipeline = redis.pipeline();
      const dataKey = `cache:geo:${key}:data`;
      
      pipeline.setex(dataKey, duration, JSON.stringify(data));
      pipeline.geoadd(`cache:geo:locations`, longitude, latitude, key);
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Geo cache error:", error);
      return false;
    }
  },

  // Get cached data by radius search
  getGeoDataByRadius: async (longitude, latitude, radius, unit = 'km') => {
    try {
      const locations = await redis.georadius(
        'cache:geo:locations',
        longitude,
        latitude,
        radius,
        unit,
        'WITHCOORD'
      );

      const pipeline = redis.pipeline();
      locations.forEach(([key]) => {
        pipeline.get(`cache:geo:${key}:data`);
      });

      const results = await pipeline.exec();
      return results.map((result, index) => ({
        key: locations[index][0],
        coordinates: locations[index][1],
        data: result[1] ? JSON.parse(result[1]) : null
      }));
    } catch (error) {
      console.error("Geo cache get error:", error);
      return [];
    }
  },

  // Cache metrics
  getCacheMetrics: async () => {
    try {
      const metrics = await redis.hgetall('cache:metrics');
      return {
        hits: parseInt(metrics.hits || 0),
        misses: parseInt(metrics.misses || 0),
        ratio: metrics.hits ? 
          (parseInt(metrics.hits) / (parseInt(metrics.hits) + parseInt(metrics.misses))) * 100 : 
          0
      };
    } catch (error) {
      console.error("Metrics error:", error);
      return { hits: 0, misses: 0, ratio: 0 };
    }
  }
};

module.exports = {
  redis,
  cacheMiddleware,
  CACHE_TYPES
};
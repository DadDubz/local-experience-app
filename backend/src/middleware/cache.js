const Redis = require("ioredis");

// Initialize Redis client with Redis Cloud credentials
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
});

// Monitor Redis connection
redis.on('error', (error) => {
  console.error('Redis Error:', error);
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

// Cache types
const CACHE_TYPES = {
  WEATHER: 'weather',
  TRAILS: 'trails',
  FISHING: 'fishing',
  GUIDES: 'guides',
  USER: 'user'
};

const cacheMiddleware = {
  // Cache middleware
  cache: (type = null, customDuration = null) => {
    return async (req, res, next) => {
      if (req.method !== "GET") return next();

      let duration = customDuration;
      if (!duration) {
        switch (type) {
          case CACHE_TYPES.WEATHER: duration = 1800; break;
          case CACHE_TYPES.TRAILS: duration = 86400; break;
          case CACHE_TYPES.FISHING: duration = 3600; break;
          case CACHE_TYPES.GUIDES: duration = 43200; break;
          case CACHE_TYPES.USER: duration = 300; break;
          default: duration = 3600;
        }
      }

      const key = `cache:${type}:${req.originalUrl}`;

      try {
        const cachedData = await redis.get(key);
        if (cachedData) {
          await redis.hincrby('cache:metrics', 'hits', 1);
          return res.json(JSON.parse(cachedData));
        }

        await redis.hincrby('cache:metrics', 'misses', 1);

        const originalJson = res.json;
        res.json = function (data) {
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

  // Clear cache by type or pattern
  clearCache: (type = null, pattern = '*') => {
    return async (req, res, next) => {
      try {
        const searchPattern = type
          ? `cache:${type}:${pattern}`
          : `cache:${pattern}`;

        const keys = await redis.keys(searchPattern);
        if (keys.length > 0) {
          await redis.del(keys);
          console.log(`🧹 Cleared ${keys.length} keys for pattern: ${searchPattern}`);
        }

        next();
      } catch (error) {
        console.error("Cache clear error:", error);
        next();
      }
    };
  },

  // Batch insert data into cache
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

  // Batch get cached data
  getBatchCachedData: async (keys, type = null) => {
    try {
      const cacheKeys = keys.map(key =>
        type ? `cache:${type}:${key}` : `cache:${key}`
      );

      const results = await redis.mget(cacheKeys);
      return results.map(item => (item ? JSON.parse(item) : null));
    } catch (error) {
      console.error("Batch cache get error:", error);
      return keys.map(() => null);
    }
  },

  // Add geospatial data to cache
  cacheGeoData: async (key, longitude, latitude, data, duration = 3600) => {
    try {
      const pipeline = redis.pipeline();
      const dataKey = `cache:geo:${key}:data`;

      pipeline.setex(dataKey, duration, JSON.stringify(data));
      pipeline.geoadd('cache:geo:locations', longitude, latitude, key);

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Geo cache error:", error);
      return false;
    }
  },

  // Retrieve geospatial data by radius
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

  // Cache performance metrics
  getCacheMetrics: async () => {
    try {
      const metrics = await redis.hgetall('cache:metrics');
      const hits = parseInt(metrics.hits || 0);
      const misses = parseInt(metrics.misses || 0);
      const total = hits + misses;
      return {
        hits,
        misses,
        ratio: total ? (hits / total * 100).toFixed(2) : '0.00'
      };
    } catch (error) {
      console.error("Metrics error:", error);
      return { hits: 0, misses: 0, ratio: '0.00' };
    }
  }
};

module.exports = {
  redis,
  cacheMiddleware,
  CACHE_TYPES
};

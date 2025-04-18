// backend/src/utils/redisClient.js
const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis-13876.c14.us-east-1-2.ec2.redns.redis-cloud.com',
  port: 13876,
  username: 'default',
  password: 'q5bfFmvodAYd0qXhMzTXAUe2yy3FZlG0',
  tls: {}, // Required for SSL
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
});

redis.on('connect', () => {
  console.log('✅ Redis Cloud connected');
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

module.exports = redis;

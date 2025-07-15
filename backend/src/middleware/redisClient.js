// src/middleware/redisClient.js
import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

await client.connect();

console.log('✅ Redis client connected');

export default client;

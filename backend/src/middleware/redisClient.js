// src/middleware/redisClient.js
import { createClient } from 'redis';

let client;

export async function getRedisClient() {
  if (client) return client;

  client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    },
  });

  client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
  });

  await client.connect();
  console.log('✅ Redis client connected');

  return client;
}

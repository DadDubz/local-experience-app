// backend/src/utils/redisClient.js
import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: 'kZU0wtSyc6IFMuY1fMpcffT4gvwLNfMi',
  socket: {
    host: 'redis-10269.c9.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 10269,
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

export { client, connectRedis };

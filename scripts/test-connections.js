require('dotenv').config();
const mongoose = require('mongoose');
const Redis = require('ioredis');

(async () => {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      tls: {},
    });
    await redis.set("health", "ok");
    const val = await redis.get("health");
    console.log("✅ Redis connected:", val);
    redis.disconnect();
  } catch (err) {
    console.error("❌ Redis failed:", err.message);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB failed:", err.message);
  }
})();

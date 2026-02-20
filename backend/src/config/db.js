// backend/src/config/db.js
import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error('Mongo URI is missing. Set MONGODB_URI (or MONGO_URI) in your environment variables.');
  }

  mongoose.set('bufferCommands', false);

  if (!mongoose.connection.__hasListeners) {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected (mongoose)');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected (mongoose)');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error (mongoose):', err?.message || err);
    });

    mongoose.connection.__hasListeners = true;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err?.message || err);
    process.exit(1);
  }
}

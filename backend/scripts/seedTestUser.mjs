import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const TEST_USER_EMAIL = (process.env.TEST_USER_EMAIL || 'test@localexperience.app').toLowerCase();
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPass123!';
const TEST_USER_NAME = process.env.TEST_USER_NAME || 'Test Explorer';

if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in environment variables.');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const existing = await User.findOne({ email: TEST_USER_EMAIL });

    if (existing) {
      existing.name = TEST_USER_NAME;
      existing.password = TEST_USER_PASSWORD;
      existing.status = 'active';
      await existing.save();
      console.log(`✅ Updated test user: ${TEST_USER_EMAIL}`);
    } else {
      await User.create({
        name: TEST_USER_NAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        role: 'user',
        status: 'active',
      });
      console.log(`✅ Created test user: ${TEST_USER_EMAIL}`);
    }

    console.log('Credentials for login:');
    console.log(`  email: ${TEST_USER_EMAIL}`);
    console.log('  password: (hidden, see TEST_USER_PASSWORD environment variable)');
  } catch (err) {
    console.error('❌ Failed to seed test user:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();

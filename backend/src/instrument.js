// backend/src/instrument.js
import * as Sentry from '@sentry/node';

// Initialize Sentry with environment variables
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profileSampleRate: 1.0,
});

// Export Sentry (optional, if you need to use it elsewhere)
export default Sentry;

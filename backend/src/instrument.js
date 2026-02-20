// backend/src/instrument.js

const initSentry = async () => {
  if (!process.env.SENTRY_DSN) {
    console.log('ℹ️ SENTRY_DSN not set, skipping Sentry initialization');
    return null;
  }

  try {
    const Sentry = await import('@sentry/node');

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      profileSampleRate: 1.0,
    });

    console.log('✅ Sentry initialized');
    return Sentry;
  } catch (error) {
    console.warn('⚠️ Sentry package is not installed. Continuing without Sentry.');
    return null;
  }
};

await initSentry();

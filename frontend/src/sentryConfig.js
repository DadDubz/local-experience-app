// sentryConfig.js
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://54203e5fcfaa42c92bc3fc685c9d1ce3@o4509009671815168.ingest.us.sentry.io/4509136637067264",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // Adjust this for performance monitoring
});
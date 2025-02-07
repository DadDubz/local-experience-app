const prometheus = require("prom-client");
const collectDefaultMetrics = prometheus.collectDefaultMetrics;

// Enable default metrics collection
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

const activeUsers = new prometheus.Gauge({
  name: "app_active_users",
  help: "Number of active users",
});

const failedLogins = new prometheus.Counter({
  name: "app_failed_logins_total",
  help: "Total number of failed logins",
});

module.exports = {
  metrics: {
    httpRequestDurationMicroseconds,
    activeUsers,
    failedLogins,
  },
};

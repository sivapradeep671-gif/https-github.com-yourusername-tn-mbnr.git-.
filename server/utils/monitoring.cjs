/**
 * Application Monitoring & Observability
 * Fulfills Section 5: Error Tracking and Performance Monitoring
 */
const logger = require('./logger.cjs');

// Stub for Prometheus metrics registry
const metricsRegistry = {
  requestsTotal: 0,
  activeConnections: 0,
  errorCount: 0,
  cpuUsageAvg: 0,
  memoryUsageMB: 0
};

/**
 * Initializes Error Tracking (e.g., Sentry) and Performance Metrics (Prometheus).
 */
function initMonitoring(app) {
  logger.info('[Observability] Initializing Sentry error tracking stubs...');
  logger.info('[Observability] Initializing Prometheus metrics export at /metrics...');

  // Middleware to track request performance and count
  app.use((req, res, next) => {
    metricsRegistry.requestsTotal++;
    metricsRegistry.activeConnections++;
    const start = process.hrtime();

    res.on('finish', () => {
      metricsRegistry.activeConnections--;
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1e3 + diff[1] * 1e-6;

      if (res.statusCode >= 400) {
        metricsRegistry.errorCount++;
        logger.error(`[Metrics] API Error: ${req.method} ${req.url}`, {
          statusCode: res.statusCode,
          durationMs: timeMs.toFixed(2)
        });
      }
    });

    next();
  });

  // Expose metrics endpoint for Prometheus scraping
  app.get('/metrics', (req, res) => {
    const memoryUsage = process.memoryUsage();
    metricsRegistry.memoryUsageMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    
    // Format response in Prometheus text format
    let metricsOutput = `# HELP http_requests_total The total number of HTTP requests.\n`;
    metricsOutput += `# TYPE http_requests_total counter\n`;
    metricsOutput += `http_requests_total ${metricsRegistry.requestsTotal}\n\n`;
    
    metricsOutput += `# HELP node_memory_usage_mb Node.js heap memory usage in MB.\n`;
    metricsOutput += `# TYPE node_memory_usage_mb gauge\n`;
    metricsOutput += `node_memory_usage_mb ${metricsRegistry.memoryUsageMB}\n\n`;

    metricsOutput += `# HELP error_count_total Total 4xx and 5xx errors.\n`;
    metricsOutput += `# TYPE error_count_total counter\n`;
    metricsOutput += `error_count_total ${metricsRegistry.errorCount}\n`;

    res.set('Content-Type', 'text/plain');
    res.send(metricsOutput);
  });
}

/**
 * Capture unhandled exceptions
 */
function setupCrashReporting() {
  process.on('uncaughtException', (err) => {
    logger.error('CRITICAL: Uncaught Exception! Shutting down gracefully...', { error: err.message, stack: err.stack });
    // In production, Sentry.captureException(err) would be called here.
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('CRITICAL: Unhandled Rejection at Promise', { reason });
  });
}

module.exports = {
  initMonitoring,
  setupCrashReporting
};

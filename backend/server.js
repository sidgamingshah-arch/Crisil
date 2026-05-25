require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const { initSockets } = require('./src/sockets');
const { initFirebase } = require('./src/config/firebase');
const { getRedisClient } = require('./src/config/redis');
const { initRateLimiters } = require('./src/middleware/rateLimiter');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  initFirebase();

  let redisClient;
  try {
    redisClient = await getRedisClient();
    logger.info('Redis connected');
  } catch (err) {
    logger.warn('Redis unavailable — rate limiting will use in-memory fallback', { err: err.message });
  }

  initRateLimiters(redisClient);

  const app = createApp();
  const httpServer = http.createServer(app);
  await initSockets(httpServer);

  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`TourMate API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    httpServer.close(() => process.exit(0));
  });
}

start().catch((err) => {
  logger.error('Failed to start server', { err: err.message, stack: err.stack });
  process.exit(1);
});

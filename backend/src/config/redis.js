const { createClient } = require('redis');
const logger = require('../utils/logger');

let client;

async function getRedisClient() {
  if (client) return client;
  client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  client.on('error', (err) => logger.error('Redis error', { err: err.message }));
  client.on('connect', () => logger.info('Redis connected'));
  await client.connect();
  return client;
}

async function closeRedis() {
  if (client) await client.quit();
}

module.exports = { getRedisClient, closeRedis };

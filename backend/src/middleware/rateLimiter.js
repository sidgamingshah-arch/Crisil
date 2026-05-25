const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');
const AppError = require('../utils/AppError');

let generalLimiter;
let authLimiter;
let locationLimiter;

function initRateLimiters(redisClient) {
  const opts = redisClient
    ? { storeClient: redisClient, useRedisPackage: true }
    : {};

  generalLimiter = redisClient
    ? new RateLimiterRedis({ ...opts, keyPrefix: 'rl_general', points: 100, duration: 900 })
    : new RateLimiterMemory({ points: 100, duration: 900 });

  authLimiter = redisClient
    ? new RateLimiterRedis({ ...opts, keyPrefix: 'rl_auth', points: 5, duration: 900 })
    : new RateLimiterMemory({ points: 5, duration: 900 });

  locationLimiter = redisClient
    ? new RateLimiterRedis({ ...opts, keyPrefix: 'rl_location', points: 12, duration: 60 })
    : new RateLimiterMemory({ points: 12, duration: 60 });
}

function makeMiddleware(getLimiter) {
  return async (req, res, next) => {
    const limiter = getLimiter();
    if (!limiter) return next();
    const key = req.user?.id || req.ip;
    try {
      await limiter.consume(key);
      next();
    } catch {
      next(AppError.tooManyRequests());
    }
  };
}

module.exports = {
  initRateLimiters,
  general: makeMiddleware(() => generalLimiter),
  auth: makeMiddleware(() => authLimiter),
  location: makeMiddleware(() => locationLimiter),
};

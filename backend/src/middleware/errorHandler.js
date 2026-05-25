const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message,
      },
    });
  }

  // Knex / PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE', message: 'Record already exists' },
    });
  }
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_REFERENCE', message: 'Referenced record does not exist' },
    });
  }

  // Joi validation errors (from validate middleware)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.details[0].message,
        fields: err.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
      },
    });
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}

module.exports = errorHandler;

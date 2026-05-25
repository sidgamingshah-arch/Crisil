const Joi = require('joi');

const listQuery = Joi.object({
  destination_id: Joi.string().uuid().required(),
  category: Joi.string().valid('tour', 'adventure', 'cultural', 'food', 'nightlife', 'sports', 'wellness', 'workshop', 'cruise', 'other'),
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

const createBooking = Joi.object({
  scheduled_at: Joi.date().iso().min('now').required(),
  notes: Joi.string().max(500),
});

module.exports = { listQuery, createBooking };

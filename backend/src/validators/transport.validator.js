const Joi = require('joi');

const createRequest = Joi.object({
  destination_id: Joi.string().uuid().required(),
  departure_time: Joi.date().iso().min('now').required(),
  seats_total: Joi.number().integer().min(1).max(20).required(),
  transport_type: Joi.string().valid('taxi', 'rideshare', 'minivan', 'bus', 'boat', 'other').default('rideshare'),
  price_per_person: Joi.number().min(0).max(10000),
  currency_code: Joi.string().length(3).uppercase().default('USD'),
  notes: Joi.string().max(500),
  pickup_lat: Joi.number().min(-90).max(90),
  pickup_lng: Joi.number().min(-180).max(180),
});

const nearbyQuery = Joi.object({
  lat: Joi.number().min(-90).max(90),
  lng: Joi.number().min(-180).max(180),
  radius: Joi.number().integer().min(100).max(50000).default(10000),
  destination_id: Joi.string().uuid(),
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

const joinRequest = Joi.object({
  seats: Joi.number().integer().min(1).max(10).default(1),
});

module.exports = { createRequest, nearbyQuery, joinRequest };

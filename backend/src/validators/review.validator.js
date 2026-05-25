const Joi = require('joi');

const submitReview = Joi.object({
  reviewee_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000),
  trip_context: Joi.string().valid('transport', 'activity').required(),
  transport_request_id: Joi.string().uuid(),
  activity_booking_id: Joi.string().uuid(),
});

module.exports = { submitReview };

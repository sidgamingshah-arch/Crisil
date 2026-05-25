const Joi = require('joi');

const createConversation = Joi.object({
  target_user_id: Joi.string().uuid(),
  transport_request_id: Joi.string().uuid(),
  activity_booking_id: Joi.string().uuid(),
}).or('target_user_id', 'transport_request_id', 'activity_booking_id');

const sendMessage = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
  type: Joi.string().valid('text', 'image', 'location').default('text'),
  metadata: Joi.object(),
});

const messagesQuery = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  before: Joi.date().iso(),
});

module.exports = { createConversation, sendMessage, messagesQuery };

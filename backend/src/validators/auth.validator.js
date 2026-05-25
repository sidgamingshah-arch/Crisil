const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  preferred_language: Joi.string().length(2).default('en'),
});

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(80),
  bio: Joi.string().max(500),
  languages: Joi.array().items(Joi.string().length(2)).max(10),
  nationality: Joi.string().max(80),
  phone: Joi.string().max(20),
  preferred_language: Joi.string().length(2),
  avatar_url: Joi.string().uri(),
});

const updateFcm = Joi.object({
  fcm_token: Joi.string().required(),
});

module.exports = { register, updateProfile, updateFcm };

const AppError = require('../utils/AppError');

const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    const err = AppError.badRequest(error.details[0].message, 'VALIDATION_ERROR');
    err.fields = details;
    return next(err);
  }
  if (source === 'body') req.body = value;
  else if (source === 'query') req.query = value;
  else req.params = value;
  next();
};

module.exports = validate;

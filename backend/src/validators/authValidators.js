const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'
      )
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long, contain uppercase and lowercase letters, '+
        'at least one number, and at least one special character.'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

function _validate(data, schema) {
  const { error } = schema.validate(data);
  if (error) {
    return {
      hasError: true,
      status: 400,
      message: error.details[0].message
    };
  }
  return {
    hasError: false,
    status: 200,
    message: ''
  };
}

function validateRegistration(user) {
  return _validate(user, registerSchema)
}

function validateLogin(user) {
  return _validate(user, loginSchema)
}

module.exports = {
  validateRegistration,
  validateLogin
}
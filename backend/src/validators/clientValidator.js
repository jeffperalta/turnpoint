const Joi = require('joi');

const clientSchema = Joi.object({
  identification: Joi.string().required(),
  name: Joi.string().min(3).required(),
  date_of_birth: Joi.date().less('now').required().label('Date of Birth'),
  main_language: Joi.string().required().label('Main Language'),
  secondary_language: Joi.string().empty('').allow(null).label('Secondary Language'),
  funding_source_id: Joi.number().allow(null).label('Funding Source')
});

function validateClient(client) {
  const { error } = clientSchema.validate(client);
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

module.exports = {
  validateClient
};
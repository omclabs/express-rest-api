const Joi = require('joi');

exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(8).max(100).required(),
    email: Joi.string().max(100).required().email(),
    password: Joi.string().min(8).required(),
    repeat_password: Joi.any().valid(Joi.ref('password')).required(),
  });
  return schema.validate(data);
};

exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const Joi = require('joi');

exports.createValidation = (data) => {
  const schema = Joi.object({
    customer_id: Joi.number().required(),
    name: Joi.string().max(100).required(),
    address: Joi.string().max(100).required(),
    phone: Joi.string().max(100).required(),
  });
  return schema.validate(data);
};

exports.editValidation = (data) => {
  const schema = Joi.object({
    customer_id: Joi.number().required(),
    name: Joi.string().max(100),
    address: Joi.string().max(100),
    phone: Joi.string().max(100),
  });
  return schema.validate(data);
};

exports.deleteValidation = (data) => {
  const schema = Joi.object({
    customer_id: Joi.number().required(),
  });
  return schema.validate(data);
};

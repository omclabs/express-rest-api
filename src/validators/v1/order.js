const Joi = require('joi');

exports.createValidation = (data) => {
  const schema = Joi.object({
    order_no: Joi.string().required(),
    customer_id: Joi.number().required(),
    value: Joi.number().required(),
  });
  return schema.validate(data);
};

exports.editValidation = (data) => {
  const schema = Joi.object({
    order_no: Joi.number().required(),
    customer_id: Joi.number().required(),
    value: Joi.number(),
  });
  return schema.validate(data);
};

exports.deleteValidation = (data) => {
  const schema = Joi.object({
    order_no: Joi.number().required(),
  });
  return schema.validate(data);
};

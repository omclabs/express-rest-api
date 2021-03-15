const Joi = require("joi");

exports.registerValidation = (data, next) => {
	let schema = Joi.object({
		name: Joi.string().min(8).max(100).required(),
		email: Joi.string().max(100).required().email(),
		password: Joi.string().min(8).required(),
		repeat_password: Joi.ref("password"),
	});
	return schema.validate(data);
};

exports.loginValidation = (data) => {
	let schema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	});
	return schema.validate(data);
};

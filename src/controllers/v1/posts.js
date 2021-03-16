const helpers = require("../../utils/helpers");
const Errors = require("../../utils/errors");

exports.getPosts = (req, res, next) => {
	try {
		res.status(201).json(helpers.formatReturn("success", 201, {}));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

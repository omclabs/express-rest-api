const helpers = require("../../utils/helpers");
const Errors = require("../../utils/errors");

exports.getPosts = (req, res, next) => {
	try {
		res.status(200).json(helpers.formatReturn("success", 200, {}));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

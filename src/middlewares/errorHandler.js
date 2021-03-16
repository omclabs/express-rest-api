const ApiError = require("../utils/errors");
const logger = require("../configs/logger");
const helpers = require("../utils/helpers");

module.exports = function (err, req, res, next) {
	logger.error({
		message: `[${err.code}] ${req.method} ${req.originalUrl} ${err.message}`,
	});

	if (err instanceof ApiError) {
		const result = {
			message: err.message,
		};
		res.status(err.code).json(helpers.formatReturn("error", err.code, result));

		return;
	}

	const result = {
		message: "Oops something went wrong",
	};
	res.status(500).json(helpers.formatReturn("error", 500, result));
};

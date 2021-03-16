const jwt = require("jsonwebtoken");
const Errors = require("../utils/errors");

module.exports = function (req, res, next) {
	const token = req.header("authorization");
	if (!token) {
		next(Errors.badRequest("Access Denied"));
		return;
	}

	try {
		const verified = jwt.verify(token, process.env.PUBLIC_SECRET_KEY);
		req.user = verified;
		next();
	} catch (err) {
		next(Errors.forbidden("Invalid Token"));
	}
};

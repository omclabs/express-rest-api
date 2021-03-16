const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const helpers = require("../../utils/helpers");
const Errors = require("../../utils/errors");

const User = require("../../models/User");
const Auth = require("../../models/Auth");
const {
	registerValidation,
	loginValidation,
} = require("../../validators/v1/auth");

exports.register = async (req, res, next) => {
	const { error } = registerValidation(req.body);

	if (error) {
		next(Errors.unprocessable(error.details[0].message.toString()));
	}

	try {
		const emailExist = await User.findOne({ email: req.body.email });
		if (emailExist) {
			next(Errors.unprocessable("Email already exists"));
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});

		await user.save();
		const result = {
			user: user._id,
		};
		res.status(201).json(helpers.formatReturn("success", 201, result));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

exports.login = async (req, res, next) => {
	const { error } = loginValidation(req.body);
	if (error) {
		next(Errors.unprocessable(error.details[0].message.toString()));
	}

	try {
		const user = await User.findOne({ email: req.body.email });
		const message = `Email or Password Failed`;
		if (!user) {
			next(Errors.unprocessable(message));
		}

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			next(Errors.unprocessable(message));
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = jwt.sign(
			{ _id: user._id },
			process.env.PRIVATE_SECRET_KEY
		);

		const exists = await Auth.findOne({ user: user._id });
		if (exists) {
			exists.token = refreshToken;
			await exists.save();
		} else {
			const auth = new Auth({
				user: user._id,
				token: refreshToken,
			});
			await auth.save();
		}

		const result = {
			user: user._id,
			access_token: accessToken,
			refresh_token: refreshToken,
		};
		res.status(201).json(helpers.formatReturn("success", 201, result));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

exports.logout = async (req, res, next) => {
	const refreshToken = req.header("authorization");
	if (!refreshToken) {
		next(Errors.unauthorize("Access denied"));
	}

	try {
		const auth = await Auth.findOne({ token: refreshToken });
		if (!auth) {
			next(Errors.forbidden("Invalid token"));
		}

		const verified = await jwt.verify(
			refreshToken,
			process.env.PRIVATE_SECRET_KEY
		);
		await auth.delete();
		const result = {
			message: "Logged out",
		};
		res.status(204).json(helpers.formatReturn("success", 204, result));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

exports.token = async (req, res, next) => {
	const refreshToken = req.header("authorization");
	if (!refreshToken) {
		next(Errors.unauthorize("Access denied"));
	}

	try {
		const auth = await Auth.findOne({ token: refreshToken });
		if (!auth) {
			next(Errors.forbidden("Invalid token"));
		}

		await jwt.verify(refreshToken, process.env.PRIVATE_SECRET_KEY);
		const accessToken = generateAccessToken(auth.user);
		const result = {
			access_token: accessToken,
		};
		res.status(201).json(helpers.formatReturn("success", 201, result));
	} catch (err) {
		next(Errors.serverError(err.message));
	}
};

function generateAccessToken(userId) {
	return jwt.sign({ _id: userId }, process.env.PUBLIC_SECRET_KEY, {
		expiresIn: "10m",
	});
}

const helpers = require("../../utils/helpers");
const User = require("../../models/User");
const Auth = require("../../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
	registerValidation,
	loginValidation,
} = require("../../validators/v1/auth");

exports.register = async (req, res, next) => {
	let { error } = registerValidation(req.body);

	if (error) {
		let message = error.details[0].message.toString();
		return res
			.status(422)
			.json(helpers.formatReturn("error", 422, {}, message));
	}

	try {
		let emailExist = await User.findOne({ email: req.body.email });
		if (emailExist) {
			return res
				.status(422)
				.json(helpers.formatReturn("error", 422, {}, "Email already exist"));
		}

		let salt = await bcrypt.genSalt(10);
		let hashedPassword = await bcrypt.hash(req.body.password, salt);
		let user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});

		await user.save();

		res
			.status(201)
			.json(
				helpers.formatReturn("success", 201, { user: user._id }, "User created")
			);
	} catch (err) {
		error = new Error("Error");
		error.status = 500;
		error.message = err.message;
		next(error);
	}
};

exports.login = async (req, res, next) => {
	let { error } = loginValidation(req.body);
	if (error) {
		let message = error.details[0].message.toString();
		return res
			.status(422)
			.json(helpers.formatReturn("error", 422, {}, message));
	}

	try {
		let user = await User.findOne({ email: req.body.email });
		let message = `Email or Password Failed`;

		if (!user) {
			return res
				.status(422)
				.json(helpers.formatReturn("error", 422, {}, message));
		}

		let validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return res
				.status(422)
				.json(helpers.formatReturn("error", 422, {}, message));
		}

		let accessToken = generateAccessToken(user._id);

		let refreshToken = jwt.sign(
			{ _id: user._id },
			process.env.PRIVATE_SECRET_KEY
		);

		let exists = await Auth.findOne({ user: user._id });
		if (exists) {
			exists.token = refreshToken;
			await exists.save();
		} else {
			let auth = new Auth({
				user: user._id,
				token: refreshToken,
			});
			await auth.save();
		}

		res.status(201);
		res.json(
			helpers.formatReturn(
				"success",
				201,
				{
					user: user._id,
					access_token: accessToken,
					refresh_token: refreshToken,
				},
				""
			)
		);
	} catch (err) {
		error = new Error("Error");
		error.status = 500;
		error.message = err.message;
		next(error);
	}
};

exports.logout = async (req, res, next) => {
	let refreshToken = req.header("authorization");

	if (!refreshToken) {
		return res
			.status(401)
			.json(helpers.formatReturn("error", 401, {}, "Access denied"));
	}

	try {
		let auth = await Auth.findOne({ token: refreshToken });

		if (!auth) {
			let message = `Invalid Token`;
			return res
				.status(403)
				.json(helpers.formatReturn("error", 403, {}, message));
		}

		let verified = await jwt.verify(
			refreshToken,
			process.env.PRIVATE_SECRET_KEY
		);

		await auth.delete();

		res
			.status(201)
			.json(helpers.formatReturn("success", 204, {}, "User deleted"));
	} catch (err) {
		error = new Error("Error");
		error.status = 500;
		error.message = err.message;
		next(error);
	}
};

exports.token = async (req, res, next) => {
	let refreshToken = req.header("authorization");

	if (!refreshToken) {
		return res
			.status(401)
			.json(helpers.formatReturn("error", 401, {}, "Access denied"));
	}

	try {
		let auth = await Auth.findOne({ token: refreshToken });

		if (!auth) {
			let message = `Invalid Token`;
			return res
				.status(403)
				.json(helpers.formatReturn("error", 403, {}, message));
		}

		let verified = await jwt.verify(
			refreshToken,
			process.env.PRIVATE_SECRET_KEY
		);

		let accessToken = generateAccessToken(auth.user);

		res.status(201).json(
			helpers.formatReturn(
				"success",
				201,
				{
					access_token: accessToken,
				},
				""
			)
		);
	} catch (err) {
		error = new Error("Error");
		error.status = 500;
		error.message = err.message;
		next(error);
	}
};

function generateAccessToken(userId) {
	return jwt.sign({ _id: userId }, process.env.PUBLIC_SECRET_KEY, {
		expiresIn: "10m",
	});
}

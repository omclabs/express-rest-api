const helpers = require("../../utils/helpers");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../../validators/v1/auth");

exports.register = async (req, res, next) => {
  let { error } = registerValidation(req.body);
  if (error)
    return res
      .status(422)
      .json(
        helpers.formatReturn(
          "error",
          422,
          {},
          error.details[0].message.toString()
        )
      );

  try {
    let emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res
        .status(422)
        .json(helpers.formatReturn("error", 422, {}, "Email already exist"));

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    let saved = await user.save();

    res.status(201);
    res.json(helpers.formatReturn("success", 201, { user: user._id }, ""));
  } catch (err) {
    error = new Error("Error");
    error.status = 500;
    error.message = err.message;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  let { error } = loginValidation(req.body);
  if (error)
    return res
      .status(422)
      .json(
        helpers.formatReturn(
          "error",
          422,
          {},
          error.details[0].message.toString()
        )
      );

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(422)
        .json(
          helpers.formatReturn("error", 422, {}, "Email or Password Failed")
        );

    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res
        .status(422)
        .json(
          helpers.formatReturn("error", 422, {}, "Email or Password Failed")
        );

    let token = jwt.sign({ _id: user._id }, process.env.PRIVATE_SECRET_KEY);
    res.status(201);
    res.json(
      helpers.formatReturn(
        "success",
        201,
        { user: user._id, authorization: token },
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

exports.generateToken = async (req, res, next) => {
  let user = req.body.user;
  let token = jwt.sign({ _id: user }, process.env.PUBLIC_SECRET_KEY, {
    expiresIn: "10m",
  });

  return res
    .status(201)
    .json(
      helpers.formatReturn(
        "success",
        201,
        { user: user, authorization: token },
        ""
      )
    );
};

const jwt = require("jsonwebtoken");
const helpers = require("../utils/helpers");

exports.public = (req, res, next) => {
  let token = req.header("authorization");
  if (!token)
    return res
      .status(401)
      .json(helpers.formatReturn("error", 401, {}, "Access denied"));

  try {
    let verified = jwt.verify(token, process.env.PUBLIC_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    error = new Error("Error");
    error.status = 403;
    error.message = "Invalid token";
    next(error);
  }
};

exports.private = (req, res, next) => {
  let token = req.header("authorization");
  if (!token)
    return res
      .status(401)
      .json(helpers.formatReturn("error", 401, {}, "Access denied"));

  try {
    let verified = jwt.verify(token, process.env.PRIVATE_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    error = new Error("Error");
    error.status = 403;
    error.message = "Invalid token";
    next(error);
  }
};

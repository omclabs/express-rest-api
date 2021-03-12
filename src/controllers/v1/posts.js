const helpers = require("../../utils/helpers");

exports.getPosts = (req, res, next) => {
  try {
    res.status(201);
    res.json(helpers.formatReturn("success", 201, {}, ""));
  } catch (err) {
    error = new Error("Error");
    error.status = 500;
    error.message = err.message;
    next(error);
  }
};

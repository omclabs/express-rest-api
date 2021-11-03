/* eslint-disable radix */
const helpers = require('../../utils/helpers');
const Errors = require('../../utils/errors');
const Order = require('../../models/Order');

exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await Order.countDocuments().exec())) {
      results.next = page + 1;
    }

    if (startIndex > 0) {
      results.previous = page - 1;
    }

    results.results = await Order.find().limit(limit).skip(startIndex).exec();
    res.status(200).json(
      helpers.formatReturn('success', 200, {
        prev: results.previous,
        next: results.next,
        results: results.results,
      }),
    );
  } catch (err) {
    next(Errors.serverError(err.message));
  }
};

// exports.createOrder = async (req, res, next) => {
//   const { error } = createValidation(req.body);
//   if (error) {
//     next(Errors.unprocessable(error.details[0].message.toString()));
//   }

//   try {
//     const results = {};
//     const order_no = 'ORD-'
//     const emailExist = await Order.findOne({ : req.body.email });
//     if (emailExist) {
//       next(Errors.unprocessable('Email already exists'));
//     }

//     results.results = await Order.find().limit(limit).skip(startIndex).exec();
//     res.status(200).json(
//       helpers.formatReturn('success', 200, {
//         prev: results.previous,
//         next: results.next,
//         results: results.results,
//       }),
//     );
//   } catch (err) {
//     next(Errors.serverError(err.message));
//   }
// };

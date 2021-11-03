/* eslint-disable radix */
const helpers = require('../../utils/helpers');
const Errors = require('../../utils/errors');
const Customer = require('../../models/Customer');
const { createValidation } = require('../../validators/v1/customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await Customer.countDocuments().exec())) {
      results.next = page + 1;
    }

    if (startIndex > 0) {
      results.previous = page - 1;
    }

    results.results = await Customer.find()
      .limit(limit)
      .skip(startIndex)
      .exec();
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

exports.createCustomers = async (req, res, next) => {
  const { error } = createValidation(req.body);

  if (error) {
    next(Errors.unprocessable(error.details[0].message.toString()));
  }

  try {
    const newCustomer = new Customer({
      customer_id: req.body.customer_id,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
    });

    await newCustomer.save();
    const result = {
      // eslint-disable-next-line no-underscore-dangle
      _id: newCustomer._id,
      customer_id: newCustomer.customer_id,
    };
    res.status(200).json(helpers.formatReturn('success', 200, { result }));
  } catch (err) {
    next(Errors.serverError(err.message));
  }
};

exports.findCustomers = async (req, res, next) => {
  try {
    const exists = await Customer.findOne({
      customer_id: req.params.customer_id,
    });

    if (!exists) {
      next(Errors.unprocessable('Customer not found'));
    }

    const data = await Customer.findOne({
      customer_id: req.params.customer_id,
    });

    const result = data;
    res.status(200).json(helpers.formatReturn('success', 200, { result }));
  } catch (err) {
    next(Errors.serverError(err.message));
  }
};

exports.deleteCustomers = async (req, res, next) => {
  try {
    const exists = await Customer.findOne({
      customer_id: req.params.customer_id,
    });

    if (!exists) {
      next(Errors.unprocessable('Customer not found'));
    }

    const data = await Customer.deleteOne({
      customer_id: req.params.customer_id,
    });

    const result = [];
    res.status(200).json(helpers.formatReturn('success', 200, { result }));
  } catch (err) {
    next(Errors.serverError(err.message));
  }
};

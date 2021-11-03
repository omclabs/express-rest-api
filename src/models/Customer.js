const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  address: {
    type: String,
    required: true,
    max: 200,
  },
  phone: {
    type: String,
    required: true,
    max: 10,
  },
});

module.exports = mongoose.model('Customer', customerSchema);

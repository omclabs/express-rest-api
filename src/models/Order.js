const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_no: {
    type: String,
    required: true,
  },
  customer_id: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);

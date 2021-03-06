const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 6,
    maxlength: 11
  }
}));

function validateCustomer(cust) {
  const schema =
  {
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(11).required(),
    isGold: Joi.boolean()
  }

  return Joi.validate(cust, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
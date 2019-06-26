const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name');
    return res.send(customers);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    });
    customer = await customer.save();

    return res.send(customer);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });

    return res.send(customer);
  } catch (err) {
    return res.status(404).send('The customer with the givenID was not found');
  }
});

router.delete('/:id', async (req, res) => {

  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    return res.send(customer);
  } catch (err) {
    return res.status(404).send('The customer with the given ID was not');
  }
});

router.get('/:id', async (req, res) => {

  try {
    const customer = await Customer.findById(req.params.id);
    return res.send(customer);
  } catch (err) {
    return res.status(404).send('The customer with the given ID was not');
  }
});

module.exports = router;
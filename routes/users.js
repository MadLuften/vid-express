const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort('name');
    return res.send(users);
  } catch(err)
  {
    console.error('Error: ', err);
  }  
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already registered.');

  try {
    let user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    return res.send(_.pick(user, ['_id', 'name', 'email']));

  } catch (err) {
    console.error('Error: ', err);
  }
});

module.exports = router;
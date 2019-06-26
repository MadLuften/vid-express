const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    return res.send(genres);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    return res.send(genre);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });

    return res.send(genre);
  } catch (err) {
    return res.status(404).send('The genre with the givenID was not found');
  }
});

router.delete('/:id', async (req, res) => {

  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    return res.send(genre);
  } catch (err) {
    return res.status(404).send('The genre with the given ID was not');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    return res.send(genre);
  } catch (err) {
    return res.status(404).send('The genre with the given ID was not');
  }
});

module.exports = router;
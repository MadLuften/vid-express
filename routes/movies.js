const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort('name');
    return res.send(movies);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.post('/', async (req, res) => {
  let genre = ''; // TODO find way to make genre constant for better stability
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try { genre = await Genre.findById(req.body.genreId); }
  catch (err) { return res.status(400).send('Post failed. Invalid genre.'); }

  try {
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    
    await movie.save();
    return res.send(movie);

  } catch (err) { console.error('Error: ', err); }
});

router.put('/:id', async (req, res) => {
  let genre = ''; // TODO same as post (make const)
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try { genre = await Genre.findById(req.body.genreId); }
  catch (err) { return res.status(400).send('Post failed. Invalid genre.'); }

  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    return res.send(movie);

  } catch (err) { return res.status(404).send('Put failed. The movie with the given ID was not found.'); }
});

router.delete('/:id', async (req, res) => {

  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    return res.send(movie);

  } catch (err) { return res.status(404).send('Delete failed. The movie with the given ID was not'); }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.send(movie);

  } catch (err) { return res.status(404).send('Get failed. The movie with the given ID was not'); }
});

module.exports = router;
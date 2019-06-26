const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  try {
    const rentals = await Rentals.find().sort('-dateOut');
    return res.send(rentals);
  } catch (err) {
    console.error('Error: ', err);
  }
});

router.post('/', auth, async (req, res) => {
  let customer = ''; // TODO find way to make constant for better stability
  let movie = '';
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try { customer = await Customer.findById(req.body.customerId); }
  catch (err) { return res.status(400).send('Post failed. Invalid customer.'); }

  try { movie = await Movie.findById(req.body.movieId); }
  catch (err) { return res.status(400).send('Post failed. Invalid movie.'); }

  if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  try {
    let newRental = new Rental({
      customer : {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
    try {
      new Fawn.Task()
      .save('rentals', newRental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      }).run();

      return res.send(newRental);
    }catch(ex) { res.status(500).send('Something failed: ', ex.message); }
  } catch (err) { console.error('Error: ', err); }
});

router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    return res.send(rental);

  } catch (err) { return res.status(404).send('Get failed. The rental with the given ID was not'); }
});

module.exports = router;
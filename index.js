require('dotenv').config();
require('express-async-errors');
const mongoose = require('mongoose');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const express = require('express');
const app = express();
const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false // must be false to avoid deprecated findOne methods
}

//console.log(process.env);
if(!process.env.API_KEY) {
  console.error('FATAL ERROR: API_KEY is not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.error('Could not connect to mongodb: ', err));

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// error middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));




module.exports = function(err, req, res, next) {
  res.status(500).send('Something failed on this end. The error has been logged.');
}
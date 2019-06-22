const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
    res.send('Awrite World');
});

module.exports = router;
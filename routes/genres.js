const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();

const genres = 
[
    {id:1, name: 'documentary'},
    {id:2, name: 'horror'},
    {id:3, name: 'comedy'}
]

router.get('/', (req, res) =>
{
    res.send(genres);
});

router.post('/', (req, res) => 
{
    const {error} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre =
    {
        id: genres.length + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => 
{
    let genre = findGenres(req, res);
    
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) =>
{
    let genre = findGenres(req, res);

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

router.get('/:id', (req, res) =>
{
    let genre = findGenres(req, res);
    res.send(genre);
});

function findGenres(request, response)
{
    const genre = genres.find(g => g.id === parseInt(request.params.id));
    if(!genre) return response.status(404).send('The genre with the given id was not found');

    return genre;
}

function validateGenre(genre)
{
    const schema = 
    {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}

module.exports = router;
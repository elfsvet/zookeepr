const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


//adding route. Get() require 2 arguments route client have to fetch and callback function.res.send will send a respond to the client
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        // req.query can look for multiple parameters
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query)
    res.json(results);
});

// new GET route for animals endpoints
router.get('/animals/:id', (req, res) => {
    // req.params looks for a single parameter
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//Users of the app populate the server with data by sending data from the client side of the application to the server.
// The route name is api/animals
router.post('/animals', (req, res) => {
    // req.body is where out incoming content will be
    // console.log(req.body);
    // here we will see the data we're posting to the server
    // req.body is where we can access that data on the server side and do something with it
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // is a response method to relay a message to the client making the request.
        // if sends them http status code and a message.
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }

});

module.exports  = router;

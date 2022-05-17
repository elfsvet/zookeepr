// a route that the front end can request data from
const { animals } = require('./data/animals.json');

// require express package
const express = require('express');
const { get } = require('http');

const PORT = process.env.PORT || 3001;

// to instantiate the server what listens for requests
const app = express();
// thats all what takes to start express.


function filterByQuery(query, animalsArray) {

    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}
//adding route. Get() require 2 arguments route client have to fetch and callback function.res.send will send a respond to the client
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        // req.query can look for multiple parameters
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query)
    res.json(results);
});

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// new GET route for animals endpoints
app.get('/api/animals/:id', (req, res) => {
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
  app.post('api/animals', (req, res) => {
      // req.body is where out incoming content will be
      console.log(req.body);
      // here we will see the data we're posting to the server
      // req.body is where we can access that data on the server side and do something with it
      res.json(req.body)
  });
  // we created a route here. POST request represents the action of a client requesting the server to accept data rather than vice versa (another way around)


// at the end we should add listen() 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// !left at 11.2.5 in the end 11.2.4 didn't much the picture.
// a route that the front end can request data from
const { animals } = require('./data/animals.json');
const fs = require('fs');
const path = require('path');
// this provides utilities for working with file and directory paths.
// it ultimately makes working with our file system a little more predictable, especially when we work with production environments such as Heroku.
// require express package
const express = require('express');
const { get } = require('http');

const PORT = process.env.PORT || 3001;

// to instantiate the server what listens for requests
const app = express();
// thats all what takes to start express.

// parse incoming string or array data
// middleware
// this method is built in the express.js. It takes incoming Post data and converts it to key/value pairings that can be accessed in the req.body object.
//  The extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// takes incoming post data in the form of JSON and parses it into the req.body JS object. 
// ! Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.


// !Every time we create a server that will serve a front end as well as JSON data, we'll always want to use this middleware. 
app.use(express.static('public'));
// some more middleware static method. We provide a file path to a location in our application(public folder) and instruct the server to make these files static resources.
// This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!

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

const findById = (id, animalsArray) => {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

const createNewAnimal = (body, animalsArray) => {
    // console.log(body);
    // our function's main code will go here!
    const animal = body;

    animalsArray.push(animal);
    // this is the synchronous version of .writeFile() and doesn't required a callback function
    fs.writeFileSync(
        // we want to write to our animals.json file in the data subdirectory, so we use the path.join() method to join the value of __dirname,
        // which represents the directory of the file we execute the code in, with the path to the animals.json file.
        // __dirname === zookeepr/ directory
        path.join(__dirname, './data/animals.json'),
        // null means we don't want to edit any of our existing data
        // if we did, we could pass something in there.
        // the 2 indicates we want to create white space between our values to make it more readable.
        // if we were to leave two arguments out, the entire animals.json file would work, but it would be really hard to read.
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
};

const validateAnimal = (animal) => {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
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
app.post('/api/animals', (req, res) => {
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
// we created a route here. POST request represents the action of a client requesting the server to accept data rather than vice versa (another way around)
// '/' brings as to the root route of our server. This is the route used to create a homepage for a server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// this route will take us to animals/when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint.
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});
// linking between pages no longer needs html extensions. it just needs the associated route name. it also doesn't need the Open in Browser extension!
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// we * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response.
// Thus, requests for /about or /contact or /membership will essentially be the same now
// ! The order of the routes matters! The * route should always come last. Otherwise, it will take precedence over names routes, and you won't see what you expect to see on routes like /zookeeper
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// at the end we should add listen() 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


// https://stark-fjord-53097.herokuapp.com/
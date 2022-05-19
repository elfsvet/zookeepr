const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
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

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

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

// stopped at 11.4.6
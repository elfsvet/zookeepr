const path = require('path');
const router = require('express').Router();

// we created a route here. POST request represents the action of a client requesting the server to accept data rather than vice versa (another way around)
// '/' brings as to the root route of our server. This is the route used to create a homepage for a server
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
// this route will take us to animals/when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint.
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
// linking between pages no longer needs html extensions. it just needs the associated route name. it also doesn't need the Open in Browser extension!
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// we * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response.
// Thus, requests for /about or /contact or /membership will essentially be the same now
// ! The order of the routes matters! The * route should always come last. Otherwise, it will take precedence over names routes, and you won't see what you expect to see on routes like /zookeeper
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});


module.exports = router;
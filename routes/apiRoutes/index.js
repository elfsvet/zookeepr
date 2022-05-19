const router = require('express').Router();
// why did we step back one folder if it in the same dir we could do ./animalRoutes
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(require("./zookeeperRoutes"));
router.use(animalRoutes);

module.exports = router;
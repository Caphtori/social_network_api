const router = require('express').Router();
const api = require('./api');

router.use('/api', api);

router.use((req, res) => res.send('Page not found.'));

module.exports = router;
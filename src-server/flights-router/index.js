const router = require('express').Router();

const errorHandler       = require('../err-handler');
const getAirlinesHandler = require('./get-arilines-handler');
const getAirportsHandler = require('./get-airports-handler');
const searchHandler      = require('./search-handler');

module.exports = router
	.get('/airlines', getAirlinesHandler)
	.get('/airports', getAirportsHandler)
	.get('/search', searchHandler)
	.use(errorHandler);

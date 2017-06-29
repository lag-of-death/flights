const requestPromise      = require('request-promise');
const {AIRLINES_ERR_CODE} = require('./error-codes');
const {location}          = require('../../config');

module.exports = (req, res, next) =>
	requestPromise
		.get(`${location}/airlines`)
		.then(data => res.send(data))
		.catch(err => next({errorCode: AIRLINES_ERR_CODE, err}));

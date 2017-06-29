const requestPromise      = require('request-promise');
const {AIRPORTS_ERR_CODE} = require('./error-codes');
const {location}          = require('../../config');

module.exports = ({query}, res, next) =>
	requestPromise
		.get(`${location}/airports?q=${query.q}`)
		.then(data => res.send(data))
		.catch(err => next({errorCode: AIRPORTS_ERR_CODE, err}));

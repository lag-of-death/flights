const express     = require('express');
const favicon     = require('serve-favicon');
const compression = require('compression');

const {PORT, pathToDist} = require('../config');
const flightsRouter      = require('./flights-router/');

module.exports = () =>
	express()
		.use(compression())
		.use(favicon(`${pathToDist}/favicon.ico`))
		.use(flightsRouter)
		.use(express.static(pathToDist))
		.listen(PORT, () => console.info(`Listening on port ${PORT}.`));

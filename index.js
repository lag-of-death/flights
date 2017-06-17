require('dotenv').config();

const path        = require('path');
const express     = require('express');
const favicon     = require('serve-favicon');
const compression = require('compression');

const flightsRouter = require('./src-server/flights-router');

const {PORT}     = process.env;
const pathToDist = path.join(__dirname, 'dist');

express()
	.use(compression())
	.use(favicon(`${pathToDist}/favicon.ico`))
	.use(flightsRouter)
	.use(express.static(pathToDist))
	.listen(PORT, () => console.info(`Listening on port ${PORT}.`));

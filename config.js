require('dotenv').config();

const path = require('path');

const {PORT}     = process.env;
const pathToDist = path.join(__dirname, 'dist');

module.exports = {
	minVersion: '>=7.10.0',
	pathToDist,
	PORT,
	location: 'http://node.locomote.com/code-task'
};

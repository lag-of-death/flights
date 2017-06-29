require('dotenv').config();

const path = require('path');

const {PORT}     = process.env;
const pathToDist = path.join(__dirname, 'dist');

module.exports = {
	pathToDist,
	PORT,
	location: 'http://node.locomote.com/code-task'
};

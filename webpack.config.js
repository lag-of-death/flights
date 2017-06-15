const path = require('path');

module.exports = {
	entry: './src-client/app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.bundle.js',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	}
};

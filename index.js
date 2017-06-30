const semver       = require('semver');
const runApp       = require('./src-server/');
const {minVersion} = require('./config');

if (semver.satisfies(process.versions.node, minVersion)) {
	runApp();
} else {
	console.error('Please use following version of Node:', minVersion);

	process.exit();
}

module.exports = model =>
	model
		.map(day => day.flights.length)
		.reduce((a, b) => Math.max(a, b), 0);

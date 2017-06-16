const rp     = require('request-promise');
const router = require('express').Router();

const R = require('ramda');

const location = 'http://node.locomote.com/code-task';

module.exports = router
	.get('/airlines', getAirlinesHandler)
	.get('/airports', getAirportsHandler)
	.get('/search', searchHandler);

function searchHandler({query}, res) {
	const {date, from, to}      = query;
	const getAdjustedDateBinded = getAdjustedDate.bind(null, date);
	const flightsDates          = [
		getAdjustedDateBinded(-2),
		getAdjustedDateBinded(-1),
		date,
		getAdjustedDateBinded(1),
		getAdjustedDateBinded(2)
	].filter(e => e >= new Date().toISOString().split('T')[0]);

	return rp
		.get(`${location}/airlines`)
		.then(data => JSON.parse(data))
		.then(airlines =>
			Promise.all(
				flightsDates.map(flightDate => {
					return Promise
						.all(airlines.map(airline =>
							getAirlineFlightsPricesForDate(`${airline.code}?date=${flightDate}&from=${from}&to=${to}`)
						))
						.then(allPricesForFlightDate => ({
							date  : flightDate,
							prices: R.flatten(allPricesForFlightDate).sort((a, b) => a - b)
						}));
				})
			)
		)
		.then(data => res.send(data))
		.catch(err => errHandler(res.send.bind(res), err));
}

function getAirlinesHandler(req, res) {
	return rp
		.get(`${location}/airlines`)
		.then(data => res.send(data))
		.catch(err => errHandler(res.send.bind(res), err));
}

function getAirportsHandler({query}, res) {
	return rp
		.get(`${location}/airports?q=${query.q}`)
		.then(data => res.send(data))
		.catch(err => errHandler(res.send.bind(res), err));
}

function errHandler(send, err) {
	console.error(err);

	send('ERR');
}

function getAdjustedDate(chosenFlightDate, differenceInDays) {
	const t = new Date(chosenFlightDate).getDate();

	return new Date(new Date(chosenFlightDate)
		.setDate(t + differenceInDays))
		.toISOString()
		.split('T')[0];
}

function getAirlineFlightsPricesForDate(path) {
	return rp(`${location}/flight_search/${path}`)
		.then(data => JSON.parse(data))
		.then(airlineFlightsForDate =>
			airlineFlightsForDate.map(singleFlight => singleFlight.price));
}

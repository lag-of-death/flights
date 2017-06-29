const R              = require('ramda');
const requestPromise = require('request-promise');

const {location}        = require('../../config');
const {SEARCH_ERR_CODE} = require('./error-codes');

const formatDate = require('../../src-shared/format-date');

module.exports = ({query}, res, next) => {
	const {date, from, to}      = query;
	const getAdjustedDateBinded = getAdjustedDate.bind(null, date);
	const flightsDates          = getFlightsDates(date, getAdjustedDateBinded);

	return requestPromise
		.get(`${location}/airlines`)
		.then(data => JSON.parse(data))
		.then(combineDatesWithAirlines(flightsDates, from, to))
		.then(data => res.send(data))
		.catch(err => next({errorCode: SEARCH_ERR_CODE, err}));
};

function combineDatesWithAirlines(flightsDates, from, to) {
	return airlines => Promise.all(
		flightsDates.map(flightDate =>
			Promise
				.all(getAirlinesFlightsForDate(airlines, flightDate, from, to))
				.then(getFlightsForDate(flightDate))
		));
}

function getFlightsForDate(flightDate) {
	return allFlights => ({
		date   : flightDate,
		flights: R.flatten(allFlights).sort((a, b) => a.price - b.price)
	});
}

function getAirlinesFlightsForDate(airlines, flightDate, from, to) {
	return airlines.map(airline =>
		getAirlineFlightsForDate(`${airline.code}?date=${flightDate}&from=${from}&to=${to}`)
	);
}

function getAdjustedDate(chosenFlightDate, differenceInDays) {
	const date    = new Date(chosenFlightDate);
	const time    = date.getDate();
	const newDate = date.setDate(time + differenceInDays);

	return formatDate(new Date(newDate));
}

function getAirlineFlightsForDate(path) {
	return requestPromise(`${location}/flight_search/${path}`)
		.then(data => JSON.parse(data))
		.then(airlineFlightsForDate => airlineFlightsForDate.map(formatData));
}

function formatData(singleFlight) {
	return {
		start : singleFlight.start.dateTime,
		finish: singleFlight.finish.dateTime,
		name  : singleFlight.airline.name,
		price : singleFlight.price
	};
}

function getFlightsDates(date, getAdjustedDateBinded) {
	return [
		getAdjustedDateBinded(-2),
		getAdjustedDateBinded(-1),
		date,
		getAdjustedDateBinded(1),
		getAdjustedDateBinded(2)
	].filter(e => e >= formatDate(new Date()));
}

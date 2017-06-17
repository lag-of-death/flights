import $ from 'jquery';
import R from 'ramda';

const getFlights = (date, from, to) => {
	return new Promise(resolve =>
		$.get(`http://localhost:3000/search?date=${date}&from=${from}&to=${to}`).then(resolve));
};

const FlightSearch = {
	AirportFrom  : 'airportFrom',
	EnableSearch : 'enableSearch',
	DisableSearch: 'disableSearch',
	AirportsFrom : 'airportsFrom',
	AirportTo    : 'airportTo',
	AirportsTo   : 'airportsTo',
	From         : 'from',
	To           : 'to',
	Date         : 'date',

	update: (model, action) => tryToUpdate(model, action) || model,

	view: (dispatch, model) =>
		$('<form/>')
			.append(
				$('<label for="from">From</label>'),
				locationInput(dispatch, R.pathOr('', ['from'], model), 'from', 'From'),
				locationsList(model.airportsFrom, dispatch, 'From'),

				$('<label for="to">To</label>'),
				locationInput(dispatch, R.pathOr('', ['to'], model), 'to', 'To'),
				locationsList(model.airportsTo, dispatch, 'To'),

				$('<label for="date">Date</label>'),
				$(`<input 
					id="date" 
					min="${new Date().toISOString().split('T')[0]}" 
					type="date" 
					value="${R.pathOr('', ['date'], model)}"/>`
				).on('change', (evt) =>
					dispatch({
						type   : FlightSearch.Date,
						payload: evt.currentTarget.value
					})()),

					$(`<input type="submit" value="${model.searchLabel}"/>`)
						.attr('disabled',
							model.flightsBeingSearched
							|| !model.airportFrom
							|| !model.airportTo
							|| !model.date
						)
			).on('submit', (evt) => {
				evt.preventDefault();

				dispatch({type: FlightSearch.DisableSearch})();

				getFlights(model.date, model.airportFrom, model.airportTo).then(flights =>
					dispatch({
						msgForParent: {
							type   : 'setFlightsData',
							payload: flights
						}
					})()
				);
			})
};

module.exports = FlightSearch;

function tryToUpdate(model, action = {}) {
	return R.has('payload', action)
		? {
			[FlightSearch.AirportFrom] : {...model, airportFrom: action.payload.code, from: action.payload.name},
			[FlightSearch.AirportsFrom]: {...model, airportsFrom: action.payload.airportsFrom},
			[FlightSearch.AirportTo]   : {...model, airportTo: action.payload.code, to: action.payload.name},
			[FlightSearch.AirportsTo]  : {...model, airportsTo: action.payload.airportsTo},
			[FlightSearch.From]        : {...model, from: action.payload, airportFrom: ''},
			[FlightSearch.To]          : {...model, to: action.payload, airportTo: ''},
			[FlightSearch.Date]        : {...model, date: action.payload}
		}[action.type]
		: {
			[FlightSearch.EnableSearch] : {...model, flightsBeingSearched: false, searchLabel: 'Search'},
			[FlightSearch.DisableSearch]: {...model, flightsBeingSearched: true, searchLabel: 'Searching...'}
		}[action.type];
}

function locationsList(model, dispatch, dir) {
	return $('<ul>').append(
		...model
			.map(airport => $('<li>')
				.append(`${airport.airportCode} - ${airport.airportName}`)
				.on('click', () => {
					dispatch({
						type   : FlightSearch[`Airport${dir}`],
						payload: {
							code: airport.airportCode,
							name: airport.airportName
						}
					})();

					dispatch({
						type   : FlightSearch[`Airports${dir}`],
						payload: {
							[`airports${dir}`]: []
						}
					})();
				}
				))
	);
}

function locationInput(dispatch, value, inputName, dir) {
	return $(`<input id="${inputName}" name="${inputName}" value="${value}"/>`)
		.on('input', function (evt) {
			const value = evt.currentTarget.value;

			dispatch({
				type        : FlightSearch[dir],
				payload     : value,
				msgForParent: {
					type   : 'nameOfFocusedInput',
					payload: inputName
				}
			})();

			if (value.length >= 2) {
				$.get(`http://localhost:3000/airports?q=${value}`)
					.then(data => {
						dispatch({
							type   : FlightSearch[`Airports${dir}`],
							payload: {
								[`airports${dir}`]: JSON.parse(data)
							}
						})();
					});
			}
		});
}

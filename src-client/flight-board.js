import $ from 'jquery';
import R from 'ramda';

const FlightBoard = {
	Flights: 'flights',

	update: (model, action) => {
		const actions = {
			[FlightBoard.Flights]: action.payload
		};

		return R.pathOr(model, [action.type], actions);
	},

	view: (dispatch, model) => {
		const numOfRows = model
			.map(day => day.flights.length)
			.reduce((a, b) => Math.max(a, b), 0);

		const trs = R.range(0, numOfRows)
			.map((val, idx) => $('<tr class="table__row"/>').append(
				...model.map(day => {
					return $('<td class="column"/>')
						.append(
							$('<div>').append(day.flights[idx].name),
							$('<div class="price">').append(day.flights[idx].price),
							$('<div>').append(`
								Departure: ${new Date(day.flights[idx].start).toISOString().split('T')[0]}
							`),
							$('<div>').append(`
								Arrival: ${new Date(day.flights[idx].finish).toISOString().split('T')[0]}
							`)
						);
				})
			));

		const ths = model.map(day => $('<th class="column-header"/>').append(day.date));

		return $('<table class="table"/>').append(
			$('<tr>').append(...ths),
			trs
		);
	}
};

module.exports = FlightBoard;

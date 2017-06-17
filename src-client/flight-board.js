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
			.map(flight => flight.prices.length)
			.reduce((a, b) => Math.max(a, b), 0);

		const trs = R.range(0, numOfRows)
			.map((val, idx) => $('<tr class="table__row"/>').append(
				...model.map(flight => {
					return $('<td class="column"/>').append(flight.prices[idx] || '-');
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

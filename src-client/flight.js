import $ from 'jquery';
import R, {compose} from 'ramda';

import FlightBoard from './flight-board';
import FlightSearch from './flight-search';

const Flight = {
	Reset: {type: 'reset'},

	FlightSearch: action => ({
		type       : 'flightSearch',
		innerAction: action
	}),

	FlightBoard: action => ({
		type       : 'flightBoard',
		innerAction: action
	}),

	init: (flightBoard, from, to, date) => ({flightBoard, flightSearch: {from, to, date}}),

	update: (model, action) => {
		const actions = {
			'reset': Flight.init([], '', '', ''),

			'flightSearch': {
				...model,
				...Flight._getMsgForFlightBoard(model, action, FlightBoard.update),
				flightSearch: FlightSearch.update(model.flightSearch, action.innerAction)
			}
		};

		return R.path(['type'], action) ? actions[action.type] : model;
	},

	view: (dispatch, model) =>
		$('<div/>').append(
			FlightSearch.view(compose(dispatch, Flight.FlightSearch), model.flightSearch),
			FlightBoard.view(compose(dispatch, Flight.FlightBoard), model.flightBoard),

			$('<button>Reset</button>').on('click', dispatch(Flight.Reset))
		),

	_getMsgForFlightBoard: (model, action, update) => {
		return R.pathSatisfies(R.equals('setFlightsData'), ['innerAction', 'msgForParent'], action)
			? {
				flightBoard: update(model.flightBoard, {
					type   : 'flights',
					payload: R.path(['innerAction', 'payload'], action)
				})
			}
			: {};
	}
};

module.exports = Flight;

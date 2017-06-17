import $ from 'jquery';
import R, {compose} from 'ramda';

import FlightBoard from './flight-board';
import FlightSearch from './flight-search';

const Flight = {
	FlightSearch: action => ({
		type       : 'flightSearch',
		innerAction: action
	}),

	FlightBoard: action => ({
		type       : 'flightBoard',
		innerAction: action
	}),

	init: (flightBoard, from, to, date, airportsFrom, airportsTo, isButtonDisabled, searchLabel) =>
		({flightBoard, flightSearch: {from, to, date, airportsFrom, airportsTo, isButtonDisabled, searchLabel}}),

	update: (model, action) => {
		const actions = {

			'flightSearch': {
				...model,
				flightSearch: FlightSearch.update(model.flightSearch, action.innerAction)
			},

			'flightBoard': {
				...model
			}
		};

		const newModel = R.path(['type'], action) ? actions[action.type] : model;

		return R.path(['innerAction', 'msgForParent'], action)
			? handleMsgsForParent(newModel, action)
			: newModel;
	},

	view: (dispatch, model) =>
		$('<div class="flights-container"/>').append(
			FlightSearch.view(compose(dispatch, Flight.FlightSearch), model.flightSearch),
			FlightBoard.view(compose(dispatch, Flight.FlightBoard), model.flightBoard)
		)

};

module.exports = Flight;

function getFlightBoardModel(model, action, update) {
	return {
		flightBoard: update(model.flightBoard, {
			type   : 'flights',
			payload: R.path(['innerAction', 'msgForParent', 'payload'], action)
		})
	};
}

function getFocusedInputModel(action) {
	return {focusedInput: action.innerAction.msgForParent.payload};
}

function handleMsgsForParent(model, action) {
	const path = ['innerAction', 'msgForParent', 'type'];

	return {
		setFlightsData    : () => {
			return Object.assign(
				{},
				model,
				{
					flightSearch: FlightSearch.update(model.flightSearch, {type: 'enableSearch'})
				},
				getFlightBoardModel(model, action, FlightBoard.update)
			);
		},
		nameOfFocusedInput: () => {
			return Object.assign({}, model, getFocusedInputModel(action));
		}
	}[R.path(path, action)]();
}

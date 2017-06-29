import R from 'ramda';

import FlightBoard from '../flight-board/';
import FlightSearch from '../flight-search/';

module.exports = (action, newModel) =>
	R.path(['innerAction', 'msgForParent'], action)
		? handleMsgsForParent(newModel, action)
		: newModel;

function handleMsgsForParent(model, action) {
	const path = ['innerAction', 'msgForParent', 'type'];

	return {
		setFlightsData    : withFlightSearchAndBoard,
		nameOfFocusedInput: withFocusedInput
	}[R.path(path, action)](model, action);
}

function withFocusedInput(model, action) {
	return Object.assign({}, model, getFocusedInputModel(action));
}

function withFlightSearchAndBoard(model, action) {
	return Object.assign(
		{},
		model,
		{
			flightSearch: FlightSearch.update(model.flightSearch, {type: 'enableSearch'})
		},
		getFlightBoardModel(model, action, FlightBoard.update)
	);
}

function getFlightBoardModel(model, action, update) {
	return {
		flightBoard: update(model.flightBoard, {
			type   : 'flights',
			payload: R.path(['innerAction', 'msgForParent', 'payload'], action)
		})
	};
}

function getFocusedInputModel(action) {
	return {
		focusedInput: action.innerAction.msgForParent.payload
	};
}

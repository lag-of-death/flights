import $ from 'jquery';
import {compose} from 'ramda';

import FlightBoard from '../flight-board/';
import FlightSearch from '../flight-search/';
import getNewModel from './get-new-model';
import toFinalModel from './to-final-model';
import actions from './actions';

module.exports = {
	update: update,

	view: (dispatch, model) =>
		$('<div class="flights-container"/>').append(
			FlightSearch.view(compose(dispatch, actions.FlightSearch), model.flightSearch),
			FlightBoard.view(compose(dispatch, actions.FlightBoard), model.flightBoard)
		)
};

function update(model, action) {
	const actions = {
		'flightSearch': {
			...model,
			flightSearch: FlightSearch.update(model.flightSearch, action.innerAction)
		},

		'flightBoard': {
			...model
		}
	};

	return toFinalModel(
		action,
		getNewModel(action, actions, model)
	);
}

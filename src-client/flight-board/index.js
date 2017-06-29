import $ from 'jquery';
import R from 'ramda';

import getNumOfRows from './get-num-of-rows';
import getThs from './get-ths';
import getTrs from './get-trs';
import actions from './actions';

module.exports = {
	update: (model, action) => {
		const actionToPayloadMap = {
			[actions.Flights]: action.payload
		};

		return R.pathOr(model, [action.type], actionToPayloadMap);
	},

	view: (dispatch, model) => {
		const numOfRows = getNumOfRows(model);

		return $('<table class="table"/>')
			.append(
				$('<tr>').append(...getThs(model)),
				getTrs(numOfRows, model)
			);
	}
};

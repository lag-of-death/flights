import $ from 'jquery';

import fromTo from './from-to.js';
import dateAndSearch from './date-and-search.js';
import setFlightsData from './set-flights-data';
import tryToUpdate from './try-to-update';

module.exports = {
	update: (model, action) => tryToUpdate(model, action) || model,

	view: (dispatch, model) =>
		$('<form class="form"/>')
			.append(
				fromTo(dispatch, model),
				dateAndSearch(dispatch, model)
			)
			.on('submit', setFlightsData(dispatch, model))
};

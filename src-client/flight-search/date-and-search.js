import $ from 'jquery';
import R from 'ramda';

import formatDate from '../../src-shared/format-date';
import actions from './actions';

module.exports = (dispatch, model) =>
	$('<div class="form__row"/>')
		.append(
			date(dispatch, model),
			search(model)
		);

function search({searchLabel, flightsBeingSearched, airportFrom, airportTo, date}) {
	return $(`
		<input 
			type="submit" 
			data-state="${searchLabel}" 
			class="search airport input" 
			value="${searchLabel}"/>`
	).attr('disabled', [flightsBeingSearched, !airportFrom, !airportTo, !date].some(R.identity));
}

function date(dispatch, model) {
	return $(`
		<input 
			id="date" 
			required
            class="date airport input"
			min="${formatDate(new Date())}" 
			type="date" 
			value="${R.pathOr('', ['date'], model)}"/>`
	).on('change', onChangeHandler(dispatch));
}

function onChangeHandler(dispatch) {
	return (evt) =>
		dispatch({
			type   : actions.Date,
			payload: evt.currentTarget.value
		})();
}

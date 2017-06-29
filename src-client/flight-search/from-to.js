import $ from 'jquery';
import R from 'ramda';

import actions from './actions';

module.exports = (dispatch, model) =>
	$('<div class="form__row"/>').append(
		$('<span class="airport airport--relative"/>')
			.append(
				locationInput(dispatch, R.pathOr('', ['from'], model), 'from', 'From'),
				locationsList(model.airportsFrom, dispatch, 'From')
			),

		$('<span class="airport airport--relative"/>')
			.append(
				locationInput(dispatch, R.pathOr('', ['to'], model), 'to', 'To'),
				locationsList(model.airportsTo, dispatch, 'To')
			)
	);

function locationsList(model, dispatch, dir) {
	return $('<ul class="airports">').append(
		...model
			.map(airport => $('<li class="airports__airport">')
				.append(`${airport.airportCode} - ${airport.airportName}`)
				.on('click', onClickHandler.bind(null, dispatch, dir, airport)))
	);
}

function onClickHandler(dispatch, dir, airport) {
	dispatch({
		type   : actions[`Airport${dir}`],
		payload: {
			code: airport.airportCode,
			name: airport.airportName
		}
	})();

	dispatch({
		type   : actions[`Airports${dir}`],
		payload: {
			[`airports${dir}`]: []
		}
	})();
}

function locationInput(dispatch, value, inputName, dir) {
	return $(`
		<input 
			class="input airport--relative__airport-name" 
			required 
			type="text" 
			placeholder="${inputName}" 
			id="${inputName}" 
			name="${inputName}" 
			value="${value}"/>`
	).on('input', onInputHandler(dispatch, dir, inputName));
}

function onInputHandler(dispatch, dir, inputName) {
	return (evt) => {
		const value = evt.currentTarget.value;

		dispatch({
			type        : actions[dir],
			payload     : value,
			msgForParent: {
				type   : 'nameOfFocusedInput',
				payload: inputName
			}
		})();

		showAirportsList(value, dispatch, dir);
	};
}

function showAirportsList(value, dispatch, dir) {
	if (value.trim().length >= 2) {
		$.get(`http://localhost:3000/airports?q=${value}`)
			.catch(err => alert(err.responseText))
			.then(airports => showAirports(dispatch, dir, JSON.parse(airports)));
	} else {
		showAirports(dispatch, dir, []);
	}
}

function showAirports(dispatch, dir, data) {
	dispatch({
		type   : actions[`Airports${dir}`],
		payload: {
			[`airports${dir}`]: data
		}
	})();
}

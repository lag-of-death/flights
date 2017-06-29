import $ from 'jquery';
import actions from './actions';

module.exports = (dispatch, model) => (evt) => {
	evt.preventDefault();

	dispatch({
		msgForParent: {
			type   : 'setFlightsData',
			payload: []
		}
	})();

	dispatch({type: actions.DisableSearch})();

	getFlights(model.date, model.airportFrom, model.airportTo).then(flights =>
		dispatch({
			msgForParent: {
				type   : 'setFlightsData',
				payload: flights
			}
		})()
	);
};

function getFlights(date, from, to) {
	return $.get(`http://localhost:3000/search?date=${date}&from=${from}&to=${to}`)
		.catch(({responseText}) => alert(responseText));
}

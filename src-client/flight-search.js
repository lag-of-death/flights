import $ from 'jquery';
import R from 'ramda';

const getFlights = () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve([
				{
					prices: [100, 140],
					date  : '2016-09-08'
				},
				{
					prices: [160],
					date  : '2016-09-09'
				},
				{
					prices: [90],
					date  : '2016-09-10'
				},
				{
					prices: [200, 160],
					date  : '2016-09-11'
				},
				{
					prices: [100],
					date  : '2016-09-12'
				}
			]);
		}, 1000);
	});
};

const FlightSearch = {
	From: 'from',
	To  : 'to',
	Date: 'date',

	update: (model, action) => FlightSearch._tryToUpdate(model, action) || model,

	view: (dispatch, model) =>
		$('<form/>')
			.append(
				$(`<input value="${R.pathOr('', ['from'], model)}"/>`).on('change', (evt) =>
					dispatch({
						type   : FlightSearch.From,
						payload: evt.currentTarget.value
					})()),

				$(`<input value="${R.pathOr('', ['to'], model)}"/>`).on('change', (evt) =>
					dispatch({
						type   : FlightSearch.To,
						payload: evt.currentTarget.value
					})()),

				$(`<input type="date" value="${R.pathOr('', ['date'], model)}"/>`).on('change', (evt) =>
					dispatch({
						type   : FlightSearch.Date,
						payload: evt.currentTarget.value
					})()),

				$('<input type="submit"/>')
			).on('submit', (evt) => {
				evt.preventDefault();

				getFlights().then(flights => dispatch({
					msgForParent: 'setFlightsData',
					payload     : flights
				})());
			}),

	_tryToUpdate: (model, action) => {
		return action
			? {
				[FlightSearch.From]: {...model, from: action.payload},
				[FlightSearch.To]  : {...model, to: action.payload},
				[FlightSearch.Date]: {...model, date: action.payload}
			}[action.type]
			: model;
	}
};

module.exports = FlightSearch;

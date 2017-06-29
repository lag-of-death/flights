import $ from 'jquery';
import R from 'ramda';

import formatDate from '../../src-shared/format-date';

module.exports = (numOfRows, model) =>
	R.range(0, numOfRows)
		.map((val, idx) =>
			$('<tr class="table__row"/>')
				.append(
					...model.map(flightInfo(idx))
				));

function flightInfo(idx) {
	return day => {
		return $('<td class="column"/>')
			.append(
				$('<div>').append(day.flights[idx].name),
				$('<div class="price">').append(day.flights[idx].price),
				$('<div>')
					.append(`Departure: ${formatDate(new Date(day.flights[idx].start))}`),
				$('<div>')
					.append(`Arrival: ${formatDate(new Date(day.flights[idx].finish))}`)
			);
	};
}

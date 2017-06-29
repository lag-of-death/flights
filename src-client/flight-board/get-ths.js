import $ from 'jquery';

module.exports = model =>
	model.map(day =>
		$('<th class="column-header"/>')
			.append(day.date)
	);

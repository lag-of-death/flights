import 'babel-polyfill';
import $ from 'jquery';

import mount from './mount';
import Flight from './flight';

mount(
	{
		initialModel: Flight.init(
			[],
			'',
			'',
			new Date().toISOString().split('T')[0],
			[],
			[],
			false,
			'Search'
		),
		update      : Flight.update,
		view        : Flight.view
	},
	$('#app')
);

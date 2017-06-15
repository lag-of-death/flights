import 'babel-polyfill';
import $ from 'jquery';

import mount from './mount';
import Flight from './flight';

mount(
	{
		initialModel: Flight.init([], '', '', ''),
		update      : Flight.update,
		view        : Flight.view
	},
	$('#app')
);

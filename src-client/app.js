import 'babel-polyfill';
import $ from 'jquery';

import mount from './mount';
import Flight from './flight/';
import formatDate from '../src-shared/format-date';

mount(
	{
		initialModel: {
			flightBoard : [],
			flightSearch: {
				from            : '',
				to              : '',
				date            : formatDate(new Date()),
				airportsFrom    : [],
				airportsTo      : [],
				isButtonDisabled: false,
				searchLabel     : 'Search'
			}
		},
		update      : Flight.update,
		view        : Flight.view
	},
	$('#app')
);

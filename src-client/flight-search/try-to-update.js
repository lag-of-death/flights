import R from 'ramda';

import actions from './actions';

module.exports = (model, action = {}) =>
	R.has('payload', action)
		? {
			[actions.AirportFrom] : {...model, airportFrom: action.payload.code, from: action.payload.name},
			[actions.AirportsFrom]: {...model, airportsFrom: action.payload.airportsFrom},
			[actions.AirportTo]   : {...model, airportTo: action.payload.code, to: action.payload.name},
			[actions.AirportsTo]  : {...model, airportsTo: action.payload.airportsTo},
			[actions.From]        : {...model, from: action.payload, airportFrom: ''},
			[actions.To]          : {...model, to: action.payload, airportTo: ''},
			[actions.Date]        : {...model, date: action.payload}
		}[action.type]
		: {
			[actions.EnableSearch] : {...model, flightsBeingSearched: false, searchLabel: 'Search'},
			[actions.DisableSearch]: {...model, flightsBeingSearched: true, searchLabel: 'Searching...'}
		}[action.type];

module.exports = {
	FlightSearch: action => ({
		type       : 'flightSearch',
		innerAction: action
	}),

	FlightBoard: action => ({
		type       : 'flightBoard',
		innerAction: action
	}),
};

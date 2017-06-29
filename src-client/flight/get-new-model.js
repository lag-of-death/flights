import R from 'ramda';

module.exports = (action, actions, model) =>
	R.path(['type'], action)
		? actions[action.type]
		: model;

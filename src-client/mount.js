module.exports = ({initialModel, update, view}, $root) => {
	let state = {...initialModel};

	const dispatch = action => () => {
		state = update(state, action);

		const $dom = view(dispatch, state);

		$root.empty().append($dom);
	};

	dispatch({})();
};

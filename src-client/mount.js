module.exports = ({initialModel, update, view}, $root) => {
	let state = {...initialModel};

	const dispatch = action => () => {
		state = update(state, action);

		const $dom = view(dispatch, state);

		$root.empty().append($dom);

		setLostFocus($dom, state);
	};

	dispatch({})();
};

function setLostFocus($dom, state) {
	$dom.ready(() =>
		$dom
			.find(`[name=${state.focusedInput}]`)
			.val(state.flightSearch[state.focusedInput])
			.focus()
	);
}

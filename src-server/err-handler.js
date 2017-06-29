// eslint-disable-next-line no-unused-vars
module.exports = ({errorCode, err}, req, res, next) => {
	console.error(`${new Date()} : ${errorCode}\n${err}`);

	res.status(500).send(`Error:${errorCode}. Please contact our support team.`);
};

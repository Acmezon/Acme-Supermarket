
exports.testCookie = function (req, res) {
	console.log(req.cookies.session);
	
	res.sendStatus(200);
}
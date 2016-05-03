Route = require('../models/route.js');

exports.getTodayRoute = function(req, res) {
	today = new Date()
	console.log("Api-getTodayRoute __today: " + today);
	Route.findOne({day: today.getDate(), month: today.getMonth(), year: today.getFullYear()})
	.exec(function (err, route) {
		if (err) {
			res.status(500).json({success:false})
		} else {
			res.status(200).json(route)
		}
	})
}
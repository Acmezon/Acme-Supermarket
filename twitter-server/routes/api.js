var ListenerApi = require('./twitter_listener_api'),
	Proportion = require('../models/proportion');

exports.ListenerApi = ListenerApi

exports.notFound = function(req, res) {
	console.log("Route not found: " + req.originalUrl);
	res.sendStatus(404);
}

exports.getAnalysis = function(req, res){
	var start = new Date()
	start.setHours(00,00,00,000);

	Proportion.find({
		'from_time' : {
			'$gte': start
		}
	}).exec(function (err, proportions){
		if(err) {
			res.sendStatus(500)
		}

		data = []
		for(i in proportions) {
			proportion = proportions[i]
			data.push({
				"hour": proportion.from_time.getHours() + "-" + proportion.to_time.getHours(),
				"positive": proportion.positive,
				"negative": proportion.negative,
				"neutral": proportion.neutral
			})
		}

		res.status(200).json(data)
	})
}
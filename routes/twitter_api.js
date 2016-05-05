var request = require('request');

exports.checkStatus = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3040/api/listener/status',
		'timeout' : 1000
	}, function (err, response, body) {
		if(err){
			res.status(200).json({ 'running' : false });
		} else {
			res.status(200).json({ 'running' : true });
		}

	})
}

exports.start = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3040/api/listener/start',
		'timeout' : 1000
	}, function (err, response, body) {
		res.sendStatus(200);
	})
}

exports.stop = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3040/api/listener/stop',
		'timeout' : 1000
	}, function (err, response, body) {
		res.sendStatus(200);
	})
}

exports.getAnalysis = function (req, res) {
	request.get({
			url: 'http://localhost:3040/api/getAnalysis',
			timeout : 1000,
		}, function(err,httpResponse,body){
			if(err){
				res.sendStatus(500)
			} else {
				if (body.length > 0) {
					var jsonBody = JSON.parse(body);
					
					res.status(200).json(jsonBody);
				} else {
					res.status.json([])
				}
			}
	});
}
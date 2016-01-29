var request = require('request');

exports.checkStatus = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3030/api/checkStatus',
		'timeout' : 1000
	}, function (err, response, body) {
		if(err){
			res.status(200).json({ 'online' : false });
		} else {
			res.status(200).json({ 'online' : true });
		}

	})
}
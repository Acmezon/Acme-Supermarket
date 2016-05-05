var request = require('request')

exports.todayRoutePlanification = function(callback) {
	request.get('http://localhost:3033/api/routes/calculate',
		function (err, response, body){
			callback(err, response);
		}
	);
}
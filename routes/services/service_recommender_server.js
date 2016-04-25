var request = require('request');

exports.recommendRates = function(customer_id, callback) {
	request.get('http://localhost:3030/api/recommend/rates/' + customer_id,
		function (err, response, body){
			callback(err, response);
		}
	);
}

exports.recommendPurchases = function(customer_id, callback) {
	request.get('http://localhost:3030/api/recommend/purchases/' + customer_id,
		function (err, response, body){
			callback(err, response);
		}
	);
}

exports.computeSimilarity = function(callback) {
	request.get('http://localhost:3030/api/updateParameters/1',
		function (err, response, body){
			callback(err, response);
		}
	);
}
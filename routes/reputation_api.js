var db_utils = require('./db_utils'),
	Reputation = require('../models/reputation'),
	ReputationService = require('./services/service_reputation'),
	ActorService = require('./services/service_actors');

//Devuelve la reputacion media para un supplier
exports.getAverageReputationBySupplierId = function (req, res) {
	var _code = req.params.id;
	console.log('GET /api/averageReputationBySupplierId/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			ReputationService.averageReputation(function (err, results) {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}
				var reputation = results[0].avg;

				res.status(200).json(reputation);
			});
		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});
};
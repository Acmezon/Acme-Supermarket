var db_utils = require('./db_utils'),
	Reputation = require('../models/reputation'),
	ReputationService = require('./services/service_reputation'),
	ActorService = require('./services/service_actors'),
	SupplierService = require('./services/service_suppliers'),
	Provide = require('../models/provide');

// Returns average reputation of a supplier identified by id
exports.getAverageReputationBySupplierId = function (req, res) {
	var _code = req.params.id;
	console.log('Function-reputationApi-averageReputationBySupplierId  --  id: ' + _code);

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

// Returns the reputations of an active provide and avgRating
exports.getReputationByProvideId = function (req, res) {
	var _code = req.params.id;
	console.log('Function-reputationApi-getReputationByProvideId  -- id: ' + _code);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	SupplierService.getPrincipalSupplier(cookie, jwtKey, function (supplier) {
		if (supplier) {
			// Get provides of supplier
			Provide.findOne({_id: _code, deleted: false}).exec(function (err, provide) {
				if (err) {
					res.status(500).json({success: false});
				} else {
					// Check principal is its supplier
					if (provide.supplier_id==supplier._id) {
						// CONTINUE
						Reputation.find({provide_id: provide._id}, function (err, reputations) {
							if (err) {
								res.status(500).json({success: false});
							} else {
								if (reputations.length) {
									var avg = 0;
									reputations.forEach(function (reputation) {
										avg += reputation.value;
									});
									avg = avg / reputations.length;
									res.status(200).json({reputations: reputations, avgRating: avg});
								} else {
									res.status(200).json({reputations: reputations});
								}
							}
						});
					} else {
						res.status(403).json({success: false});
					}
				}
			});
		} else {
			// Supplier not found in DB or cookie
			res.status(403).json({success: false});
		}
	});

};
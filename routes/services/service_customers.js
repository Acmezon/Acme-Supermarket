var Actor = require('../models/actor')

exports.checkPrincipalOrAdmin = function(cookie, jwtKey, customer_id, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, actor){
						if (err) {
							callback(false);
						} else {
							var role = actor._type.toLowerCase();
							callback( (role=='admin') || (role=='customer' && actor._id==customer_id) );
						}
					});
				}
			});
		}
	}
}

exports.checkOwnerOrAdmin = function(cookie, jwtKey, credit_card_id, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, actor){
						if (err) {
							callback(false);
						} else {
							var role = actor._type.toLowerCase();
							callback( (role=='admin') || (role=='customer' && actor.credit_card_id==credit_card_id) );
						}
					});
				}
			});
		}
	}
}
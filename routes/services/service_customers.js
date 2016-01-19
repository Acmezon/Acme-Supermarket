var Actor = require('../../models/actor'),
	Provide = require('../../models/provide'),
	Purchase = require('../../models/purchase'),
	PurchaseLine = require('../../models/purchase_line'),
	jwt = require('jsonwebtoken');

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

exports.checkPurchasing = function (user_id, product_id, callback) {


	Provide.find({ product_id : product_id }, function (err, provides) {
		if (err || provides.length == 0) {
			callback(false);
			return;
		}

		var provide_ids = [];

		for(var i = 0; i < provides.length; i++) {
			provide_ids.push(provides[i]._id);
		}

		PurchaseLine.find({ 'provide_id' : { $in: provide_ids } }, function (err, lines) {
			if(err || lines.length == 0) {
				callback(false);
				return;
			}

			var purchase_ids = [];

			for (var i = 0; i < lines.length; i++) {
				if(purchase_ids.indexOf(lines[i].purchase_id < 0))
					purchase_ids.push(lines[i].purchase_id);
			}

			Purchase.find({ '_id' : { $in : purchase_ids } }, function (err, purchases) {
				if(err || purchases.length == 0) {
					callback(false);
					return;
				}

				for(var i = 0; i < purchases.length; i++) {
					if ( String(purchases[i].customer_id) == String(user_id)) {
						callback(true);
						return;
					}
				}
				callback(false);
				return;
			});
		});
	});
}
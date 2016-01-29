var Actor = require('../../models/actor'),
	jwt = require('jsonwebtoken');

// Returns a String with the role of principal (admin, customer, supplier, anonymous)
exports.getUserRole = function (cookie, jwtKey, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback('anonymous');
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, user){
						if (err) {
							callback('anonymous');
						} else {
							if (user) {
								var type = user._type.toLowerCase();
								if (type) {
									callback(type);
								} else {
									callback('anonymous');
								}
							} else {
								callback('anonymous');
							}
						}
					});
				}
			});
		} else {
			callback('anonymous');
		}
	} else {
		callback('anonymous');
	}
}

// Returns email and password of principal [email, password]
exports.getPrincipal = function(cookie, jwtKey, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(-1);
				} else {
					callback([decoded.email, decoded.password]);
				}
			});

		} else {
			callback(-1);
		}
	} else {
		callback(-1);
	}
}

// Returns true if principal is same as user_id passed
exports.checkPrincipal = function (cookie, jwtKey, user_id, callback) {
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
					}, function (err, user){
						if (err) {
							callback(false);
						} else {
							if (decoded.email==user.email && decoded.password==user.password && user_id==user._id) {
								callback(true);
							} else {
								callback(false);
							}
						}
					});
				}
			});
		}
	}
}
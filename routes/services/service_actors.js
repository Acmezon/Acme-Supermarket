var jwt = require('jsonwebtoken');

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
							var type = user._type.toLowerCase();
							if (type) {
								callback(type);
							} else {
								callback('anonymous');
							}
						}
					});
				}
			});
		}
	}
}

exports.checkPrincipal = function (cookie, jwtKey, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, user){
						if (err) {
							callback(false);
						} else {
							if (decoded.email==user.email && decoded.password==user.password && req.params.id==user._id) {
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
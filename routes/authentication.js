var db = require('./db_utils'),
	Actor = require('../models/actor'),
	Customer = require('../models/customer'),
	jwt = require('jsonwebtoken'),
	customers_api = require('./customers_api'),
	crypto = require('crypto'),
	cookieParser = require('cookie-parser'),
	ActorService = require('./services/service_actors');

// Authenticate in the system
exports.authenticate = function (req, res) {
	console.log('Function-authenticationApi-authenticating -- email:'+req.body.email);

	Actor.findOne({
		email: req.body.email
	}, function (err, user){
		console.log(user);
		if (err) {
			res.json({success: false, message: 'Server error. Please, try again later.'});
		}

		if(!user){
			res.json({success: false, message: 'Login failed. Email not found.'});
		}else if (user) {
			var md5Password = crypto.createHash('md5').update(req.body.password).digest("hex");
			if(user.password != md5Password) {
				res.json({success: false, message: 'Login failed. Wrong password.'})
			} else {


				var token = jwt.sign(
					{
						email: user.email, 
                    	password: user.password
                    },
                    req.app.get('superSecret'), 
                    {
					expiresIn: 365 * 24 * 60 * 60 //1 year
				});

				res.cookie('session', {
					token: token
				}, {
					maxAge: 365 * 24 * 60 * 60 * 1000
				});

				res.json({success: true});
			}
		}
	});
};

// Clears out the session cookies
exports.disconnect = function (req, res) {
	console.log('Function-authenticationApi-disconnecting');
	res.clearCookie('session');
	res.clearCookie('shoppingcart')
	res.sendStatus(200);
};

// Register a customer into the system
exports.signup = function (req, res) {
	console.log('Function-authenticationApi-signingup -- email:' + req.body.name);

	var customer = {
		name : req.body.name,
		surname : req.body.surname,
		email : req.body.email,
		coordinates: req.body.coordinates,
		password : req.body.password,
		credit_card_id: req.body.credit_card_id,
		address : req.body.address,
		country : req.body.country,
		city : req.body.city,
		phone : req.body.phone
	};
	
	customers_api.newCustomer(customer, 
		function (errors) {
			if(errors.length > 0) {
				console.log(errors);
				res.status(500).json({success: false, message: errors});
			} else {
				res.status(200).json({success: true});
			}
		}
	);
};

// Checks if principal is authenticated: Session cookie valid
exports.isAuthenticated = function(req, res) {
	console.log('Function-authenticationApi-isAuthenticated');

	var cookie = req.cookies.session;

	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					res.status(200).json( {success: false} );
				} else {
					// if everything is good, save to request for use in other routes
					//req.decoded = decoded;
					res.status(200).json({success: true});
				}
			});

		} else {
			res.status(200).json( {success: false} );
		}
	} else {
		res.status(200).json( {success: false} );
	}
};

// Returns role of principal
exports.getUserRole = function(req, res) {
	console.log('Function-authenticationApi-getUserRole');
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		res.status(200).send(role);
	});
};
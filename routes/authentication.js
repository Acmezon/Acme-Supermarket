var db = require('./db_utils'),
	Actor = require('../models/actor'),
	Customer = require('../models/customer'),
	jwt = require('jsonwebtoken'),
	customers_api = require('./customers_api'),
	crypto = require('crypto'),
	cookieParser = require('cookie-parser');

exports.authenticate = function (req, res) {

	//TODO check if is Admin
	Actor.findOne({
		email: req.body.email
	}, function (err, user){
		if (err) {
			res.json({success: false, message: 'Server error. Please, try again later.'});
		}

		console.log(user);
		if(!user){
			res.json({success: false, message: 'Login failed. Email not found.'});
		}else if (user) {
			var md5Password = crypto.createHash('md5').update(req.body.password).digest("hex");
			if(user.password != md5Password) {
				res.json({success: false, message: 'Login failed. Wrong password.'})
			} else {
				var token = jwt.sign(user, req.app.get('superSecret'), {
					expiresIn: 365 * 24 * 60 * 60 //1 year
				});

				console.log(token);
				res.cookie('session', {
					token: token,
					type: 'customer'
				}, {
					maxAge: 365 * 24 * 60 * 60 * 1000
				});
				res.json({success: true});
			}
		}
	});
}

//Sign-in a customer into de system
exports.signup = function (req, res) {
	var customer = {
		name : req.body.name,
		surname : req.body.surname,
		email : req.body.email,
		password : req.body.password,
		credit_card: req.body.credit_card,
		address : req.body.address,
		country : req.body.country,
		city : req.body.city,
		phone : req.body.phone
	};
	
	customers_api.newCustomer(customer, 
		function (errors) {
			if(errors.length > 0) {
				res.status(500).json({success: false, message: errors});
			} else {
				res.status(200).json({success: true});
			}
		}
	);
	/*
	//Check if the email is already in use
	Actor.findOne({email: req.body.email}, function(err,actor){
		var errors=db_utils.handleErrors(err);

		if(errors) {
			console.log('--Error in findOne actor by email -> errors:'+errors);
			throw err;
		} else {
			if(actor != null){
				console.log('Email '+req.body.email+' is already in use');
				res.status(500).json({success: false, message: 'Email already in use'});
			}
			else{
				//console.log('Email '+req.body.email+' is available');
				var user = new Customer({
					name : req.body.name,
					surname : req.body.surname,
					email : req.body.email,
					password : req.body.password,
					credit_card: req.body.credit_card,
					address : req.body.address,
					country : req.body.country,
					city : req.body.city,
					phone : req.body.phone
				});

				user.save(function(err) {
					var errors = [];
					if(err) {
						var keys = Object.keys(err.errors);
						for(key in keys) {
							key = keys[key];
							errors.push({
								key: key,
								value: err.errors[key].name
							});
						}
					}
		
					if(errors.length > 0) {
						res.status(500).json({success: false, message: errors});
					} else {
						res.status(200).json({success: true});
					}
				});
			}
		}
	});
	*/
};

exports.isAuthenticated = function(req, res) {
	var cookie = req.cookies.session;

	if (cookie !== undefined) {
		var token = cookie.token;

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					res.sendStatus(401);
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					res.json({success: true});
				}
			});

		} else {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(401);
	}
};
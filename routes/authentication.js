var db = require('./db_connection')
var Actor = require('../models/actor');
var Customer = require('../models/customer');
var jwt    = require('jsonwebtoken');
var customer_api = require('./customers_api')

exports.authenticate = function (req, res) {
	Customer.findOne({
		email: req.body.email
	}, function (err, user){
		if (err) throw err;

		if(!user){
			res.json({success: false, message: 'Authentication failed. User not found.'});
		}else if (user) {
			if(user.password != req.body.password) {
				res.json({success: false, message: 'Authentication failed. Wrong password.'})
			} else {
				var token = jwt.sign(user, req.app.get('superSecret'), {
					expiresInMinutes: 525600 //1 year
				});

				res.json({
					success: true,
					message: 'Login success.',
					token: token
				})
			}
		}
	});
}

exports.signup = function (req, res) {
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
		if(err){
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
			console.log("Saved");
			res.status(200).json({success: true});
		}
	});
}

exports.checkToken = function(token) {
	// verifies secret and checks exp
	jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
		if (err) {
			return false;
		} else {
			return true;
		}
	});
}
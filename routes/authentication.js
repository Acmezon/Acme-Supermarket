var db = require('./db_connection')
var Actor = require('../models/actor');
var Customer = require('../models/customer');
var jwt    = require('jsonwebtoken');
var customer_api = require('./customers_api')

exports.authenticate = function (req, res) {
	console.log(req.body);
	db.connect();
	
	Actor.model.findOne({
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
		if(err) throw err;

		console.log("Success");

		res.json({success: true});
	})
}
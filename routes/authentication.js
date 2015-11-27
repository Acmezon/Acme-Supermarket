var db = require('./db_connection')
var Actor = require('../models/actor');
var jwt    = require('jsonwebtoken');
var customer_api = require('./customer_api')

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
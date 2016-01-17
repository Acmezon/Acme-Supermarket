var db = require('./db_utils'),
	Actor = require('../models/actor'),
	Customer = require('../models/customer'),
	jwt = require('jsonwebtoken'),
	customers_api = require('./customers_api'),
	crypto = require('crypto'),
	cookieParser = require('cookie-parser');

exports.authenticate = function (req, res) {
	Actor.findOne({
		email: req.body.email
	}, function (err, user){
		console.log(user);
		if (err) {
			res.json({success: false, message: 'Server error. Please, try again later.'});
		}

		if(!user){
			console.log('User email in use :'+user);
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

				console.log(token)

				//Check the type of user
				var _type = 'customer';
				if(user._type == 'Admin'){
					console.log('---'+req.body.email + ' is an Admin');
					_type = 'admin';
				}else if(user._type == 'Supplier'){
					console.log('---'+req.body.email + ' is an Supplier');
					_type = 'supplier';
				}else if(user._type == 'Customer'){
					_type = 'customer';
				}else{
					res.json({success: false, message: 'Undefined type of user, contact the support team'});
				}

				res.cookie('session', {
					token: token,
					type: _type
				}, {
					maxAge: 365 * 24 * 60 * 60 * 1000
				});

				res.json({success: true});
			}
		}
	});
};

exports.disconnect = function (req, res) {
	res.clearCookie('session');
	res.clearCookie('shoppingcart')
	res.sendStatus(200);
};

//Sign-in a customer into de system
exports.signup = function (req, res) {
	var customer = {
		name : req.body.name,
		surname : req.body.surname,
		email : req.body.email,
		coordinates: req.body.coordinates,
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
				console.log(errors);
				res.status(500).json({success: false, message: errors});
			} else {
				res.status(200).json({success: true});
			}
		}
	);
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


exports.getPrincipal = function(req, res) {
	var uid = currentUser();
	res.status(200).send({ u_id: uid});
}

exports.getUserRole = function(req, res) {
	var cookie = req.cookies.session;

	if (cookie !== undefined) {
		var type = cookie.type.toLowerCase();

		if (type) {
			res.status(200).json({role: type});
		} else {
			res.status(200).json({role: 'anonymous'});
		}
	} else {
		res.status(200).json({role: 'anonymous'});
	}

};

exports.currentUser = function() {
	var cookie = req.cookies.session;

	if (cookie !== undefined) {
		var token = cookie.token;

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					return -1;
				} else {
					return email;
				}
			});

		} else {
			return -1;
		}
	} else {
		return -1;
	}
}
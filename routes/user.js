var jwt = require('jsonwebtoken'),
	Customer = require('../models/customer'),
	Actor = require('../models/actor'),
	crypto = require('crypto');

exports.getMyProfile = function (req, res) {
	var cookie = req.cookies.session;

	if (cookie !== undefined) {
		var token = cookie.token;

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					res.status(404).send({
						success: false
					});
				} else {
					var email = decoded.email;

					Customer.findOne({email: email}, function(err, customer){
						if(err){
							res.status(404).send({
								success: false
							});							
						}
						else{
							res.status(200).json({
								_type : customer._type,
								id: customer._id,
								name : customer.name,
								surname : customer.surname,
								email : customer.email,
								address : customer.address,
								country : customer.country,
								city : customer.city,
								phone: customer.phone,
								credit_card: customer.credit_card
							});
						}
					});
				}
			});

		} else {
			res.status(404).send({
				success: false
			});
		}
	} else {
		res.status(404).send({
			success: false
		});
	}
};

exports.updateUser = function (req, res) {
	var set = {}
	set[req.body.field] = req.body.data;

	Customer.findByIdAndUpdate(req.body.id, { $set: set}, function (err, product) {
		if(err){
			console.log(err);
			res.status(500).send("Unable to save field, check input.")
		} else {
			res.status(200).json({success: true});
		}
	});
};

exports.changePassword = function (req, res) {
	Actor.findOne({
		_id: req.body.id
	}, function (err, user){
		if (err) {
			res.sendStatus(503);
		}

		var md5OldPassword = crypto.createHash('md5').update(req.body.oldPass).digest("hex");
		if(user.password != md5OldPassword) {
			res.sendStatus(403);
			return;
		} else {
			var md5Password = crypto.createHash('md5').update(req.body.newPass).digest("hex");
			Actor.findByIdAndUpdate(req.body.id, { $set: { password: md5Password }}, 
			function (err, user) {
				if(err){
					res.sendStatus(503);
					return;
				} else {
					res.sendStatus(200);
					return;
				}
			});
		}
	});
};
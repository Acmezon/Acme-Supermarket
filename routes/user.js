var jwt = require('jsonwebtoken'),
	ActorService = require('./services/service_actors'),
	Customer = require('../models/customer'),
	CreditCard = require('../models/credit_card')
	Actor = require('../models/actor'),
	crypto = require('crypto');

// Get an actor object of principal
exports.getMyProfile = function (req, res) {
	console.log('Function-usersApi-getMyProfile');
	var cookie = req.cookies.session;

	if (cookie != undefined) {
		var token = cookie.token;

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
				if (err) {
					res.status(401).send({
						success: false
					});
				} else {
					var email = decoded.email;
					var password = decoded.password;

					Actor.findOne({email: email}, function (err, actor){
						if(err || !actor){
							res.status(401).send({
								success: false
							});
						}
						else{
							// Check password correct
							if (password != actor.password) {
								res.status(401).send({
									success: false
								});
							} else {
								// Check is customer
								ActorService.getUserRole(req.cookies.session, req.app.get('superSecret'), function (role) {
									if (role == 'customer') {
										res.status(200).json({
											_type : actor._type,
											id: actor._id,
											name : actor.name,
											surname : actor.surname,
											email : actor.email,
											coordinates : actor.coordinates,
											address : actor.address,
											country : actor.country,
											city : actor.city,
											phone: actor.phone,
											timeWindow: actor.timeWindow,
											credit_card: actor.credit_card_id
										});
									} else {
										// Check is admin
										if (role=='admin') {
											res.status(200).json({
												_type : actor._type,
												id: actor._id,
												name : actor.name,
												surname : actor.surname,
												email : actor.email
											});
										} else {
											if (role=='supplier') {
												res.status(200).json({
													_type : actor._type,
													id: actor._id,
													name : actor.name,
													surname : actor.surname,
													email : actor.email,
													coordinates : actor.coordinates,
													address : actor.address,
													timeWindow : actor.timeWindow
												});
											} else {
												res.status(401).send({
													success: false
												});
											}
										}
									}
								});
							}
						}
					});
				}
			});

		} else {
			res.status(401).send({
				success: false
			});
		}
	} else {
		res.status(401).send({
			success: false
		});
	}
};

// Updates an user passed by id
exports.updateUser = function (req, res) {
	console.log('Function-usersApi-updateUser  --id:'+req.body.id);

	var set = {}
	set[req.body.field] = req.body.data;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='supplier' || role=='admin') {
			ActorService.checkPrincipal(cookie, jwtKey, req.body.id, function (isPrincipal) {
				if ( (role=='customer' && isPrincipal) || (role=='supplier' && isPrincipal) || (role=='admin')) {
					Actor.findById(req.body.id).exec(function(err, actor) {
						if(err){
							res.status(500).send("User not found")
						} else {
							actor[req.body.field] = req.body.data
							actor.save(function (err) {
								if (err){
									res.status(500).send("Unable to save field, check input.")
								} else {
									res.status(200).json({success: true});
								}
							});
							
						}
					})
				} else {
					res.status(401).json({success: false, message: "Doesn't have permission"});
				}
			});
		} else {
			res.status(401).json({success: false, message: "Doesn't have permission"});
		}
	});
};

// Change password
exports.changePassword = function (req, res) {
	console.log('Function-usersApi-changePassword  --id:'+req.body.id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			ActorService.checkPrincipal(cookie, jwtKey, req.body.id, function (isPrincipal) {
				if ( (role=='customer' && isPrincipal) || (role=='supplier' && isPrincipal) || (role=='admin')) {
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
				} else {
					res.status(403).json({success: false, message: "Doesn't have permission"});
				}
			});
		} else {
			res.sendStatus(401);
		}
	});

	
};
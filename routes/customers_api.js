var Customer = require('../models/customer'),
	credit_card_api = require('./credit_card_api')
	CreditCard = require('../models/credit_card'),
	Actor = require('../models/actor'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	crypto = require('crypto'),//Necesario para encriptacion por MD5	
	db_utils = require('./db_utils'),
	jwt = require('jsonwebtoken'),
	request = require('request');

// Returns all customers of the system (W/O PASSWORDS)
exports.getCustomers = function (req, res) {
	console.log('Function-productsApi-getCustomers');

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check principal is an admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			// Find no conditions
			Customer.find({_type: 'Customer'}, function(err,customers){
				if (err) {
					res.status(500).json({success: false, message: err});
				} else {
					for (var i = 0; i < customers.length; i++) {
						customers[i].password = "";
					}
					res.status(200).json(customers);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Save a new customer
exports.newCustomer = function (customer, callback) {
	console.log('Function-customersApi-newCustomer');

	// Save the input in vars
	var _name = customer.name;
	var _surname = customer.surname;
	var _email = customer.email;
	var _password = customer.password;
	var _coordinates = customer.coordinates;
	var _address = customer.address;
	var _country = customer.country;
	var _city = customer.city;
	var _phone = customer.phone;

	// Server validation
	var pass = CustomerService.checkFieldsCorrect(_name, _surname, _email, _password, _coordinates, _address, _country, _city, _phone);

	if (pass) {
		var md5Password = crypto.createHash('md5').update(_password).digest("hex");

		var newCustomer = new Customer({
			name: _name,
			surname: _surname,
			email: _email,
			password: md5Password,
			coordinates: _coordinates,
			credit_card_id: "",
			address: _address,
			country: _country,
			city: _city,
			phone: _phone
		});

		newCustomer.save(function (err) {
			callback(db_utils.handleInsertErrors(err));
		});

		return;
	} else {
		callback('ValidationError on Server')
		return;
	}
};

// Update/Save a credit card. Check id_cc
exports.updateCC = function(req, res){
	console.log('Function-customersApi-updateCC');

	var cc = new CreditCard({
		holderName : req.body.cc.holderName,
		number : req.body.cc.number,
		expirationMonth: req.body.cc.expirationMonth,
		expirationYear: req.body.cc.expirationYear,
		cvcCode: req.body.cc.cvcCode,
	});
	// If id not set, Save
	if(!req.body.id_cc){
		credit_card_api.newCreditCard(cc, 
			function (errors) {
				if(errors.length > 0) {
					res.status(500).json({success: false, message: errors});
				} else {
					Customer.findByIdAndUpdate(req.body.customer_id, { $set : { credit_card: cc._id } }, function (err, customer) {
						if(err) {
							CreditCard.find(cc._id).remove().exec();
							res.sendStatus(503);
						} else {
							res.status(200).json({success: true});
						}
					});
					
				}
			}
		);
	} else {
		// Update

		var jwtKey = req.app.get('superSecret');
		var cookie = req.cookies.session;

		// Check principal is customer or administrator
		ActorService.getUserRole(cookie, jwtKey, function (role) {
			if (role=='customer' || role=='admin') {
				// Check principal is owner or administrator
				CustomerService.checkOwnerOrAdmin(cookie, jwtKey, req.body.id_cc, function (response) {
					if (response) {

						credit_card_api.updateCreditCard(req.body.id_cc, cc, 
							function (errors) {
								if(errors.length > 0) {
									res.status(500).json({success: false, message: errors});
								} else {
									res.status(200).json({success: true});
								}
							}
						);
					} else {
						res.status(403).json({success: false, message: "Doesnt have permission"});
					}
				});
			} else {
				res.status(403).json({success: false, message: "Doesnt have permission"});
			}
		});
	}
};

// Updates a customer with ID from the system
exports.updateCustomer = function (req, res) {
	console.log('Function-customersApi-updateCustomer  --_id:' + req.body._id);

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	// Check principal is customer or administrator
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='admin') {
			// Check principal is customer or administrator
			CustomerService.checkPrincipalOrAdmin(cookie, jwtKey, req.body._id, function (response) {
				if (response) {
					Customer.update({_id: req.body._id}, 
						{$set: 
							{name: req.body.name,
							surname: req.body.surname,
							email: req.body.email,
							address: req.body.address,
							country: req.body.country,
							city: req.body.city,
							phone: req.body.phone}
						}, 
						function(error, result) {
				      		if (error) {
				      			res.status(500).json({success: false, message: error.errors});
				      		} else {
				      			res.status(200).json({success: true});
				      		}
				    	});
				} else {
					res.status(403).json({success: false, message: "Doesnt have permission"});
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Remove a customer with ID from the system
exports.deleteCustomer = function(req, res) {
	var id= req.body.id;
	console.log('Function-customersApi-deleteCustomer -- id:'+id);

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	// Check principal is customer or administrator
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='admin') {
			// Check principal is customer or administrator
			CustomerService.checkPrincipalOrAdmin(cookie, jwtKey, req.body._id, function (response) {
				if (response) {
					Customer.remove({ _id: id }, function(err) {
					    if (!err) {
					    	res.status(200).json({success: true});
					    }
					    else {
							res.status(500).json({success: false, message: err});
					    }
					});
				} else {
					res.status(403).json({success: false, message: "Doesnt have permission"});
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Returns a credit card object of customer principal
exports.getMyCreditCard = function (req, res) {
	console.log('Function-usersApi-getMyCreditCard');

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
					var password = decoded.password;

					Customer.findOne({email: email}, function(err, customer){
						if(err){
							res.status(404).send({
								success: false
							});							
						} else{
							// Check password correct
							if (password != customer.password) {
								res.status(401).json({success: false, message: "Not authenticated"});
							} else {
								// Check is customer
								ActorService.getUserRole(req.cookies.session, req.app.get('superSecret'), function (role) {
									if (role=='customer') {
										// Posible that credit card is null
										if(customer.credit_card_id) {
											CreditCard.findOne({_id: customer.credit_card_id},
												function(err, credit_card){
													if(err) {
														res.status(404).send({
															success: false
														})
													} else {
														res.status(200).json(credit_card);
													}
											})
										} else {
											// empty credit card
											res.status(200).json(null);
										}
									} else {
										res.status(403).json({success: false, message: "Doesnt have permission"});
									}
								});
							}
						}
					});
				}
			});

		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	} else {
		res.status(401).json({success: false, message: "Not authenticated"});
	}
};

exports.getMyRecommendations = function (req, res) {
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
					var password = decoded.password;

					Customer.findOne({email: email}, function (err, customer){
						if(err){
							res.status(404).send({
								success: false
							});							
						} else{
							// Check password correct
							if (password != customer.password) {
								res.status(401).json({success: false, message: "Not authenticated"});
							} else {
								// Check is customer
								ActorService.getUserRole(req.cookies.session, req.app.get('superSecret'), function (role) {
									if (role=='customer') {
										request(
										{
											uri : 'http://localhost:3030/api/recommendations/' + customer.id,
											json : true
										}, function (error, response, body) {
											console.log(response.statusCode)
											if (error || response.statusCode == 500 || response.statusCode == 204
												|| response.statusCode == 404) {
												res.sendStatus(200);
											} else {
												res.status(200).json(body);
											}
										})
									} else {
										res.status(403).json({success: false, message: "Doesnt have permission"});
									}
								});
							}
						}
					});
				}
			});

		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	} else {
		res.status(401).json({success: false, message: "Not authenticated"});
	}
};
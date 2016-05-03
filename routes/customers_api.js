var Customer = require('../models/customer'),
	credit_card_api = require('./credit_card_api')
	CreditCard = require('../models/credit_card'),
	Actor = require('../models/actor'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	PurchasingRule = require('../models/purchasing_rule'),
	ProductService = require('./services/service_products'),
	crypto = require('crypto'),//Necesario para encriptacion por MD5	
	db_utils = require('./db_utils'),
	jwt = require('jsonwebtoken'),
	request = require('request'),
	SocialMediaService = require('./services/service_social_media'),
	sync = require('synchronize');

// Return a customer identified by id
exports.getCustomer = function (req, res) {
	var _code = req.params.id
	console.log('Function-productsApi-getCustomer -- id: ' + _code);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	// Check principal is an admin or principal customer
	CustomerService.checkPrincipalOrAdmin(cookie, jwtKey, _code, function (response) {
		if (response) {
			// Find no conditions
			Customer.findById(_code, function(err,customer){
				if (err) {
					res.status(500).json({success: false, message: err});
				} else {
					res.status(200).json(customer);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Returns a customer by its email. ONLY FOR ADMINS
exports.getCustomerByEmail = function (req, res) {
	var email = req.params.email;
	console.log('Function-productsApi-getCustomerByEmail -- email: ' + email);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='supplier' || role=='admin') {
			if (role=='admin') {
				Customer.findOne({email: email, _type: 'Customer'}).exec (function (err, customer) {
					if (err) {
						// Internal server error
						res.status(500).json({success: false});
					} else {
						
						res.status(200).json(customer);
					}
				});
			} else {
				// Doesn't have permissions
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

// Returns all customers of the system (W/O PASSWORDS)
exports.getCustomers = function (req, res) {
	console.log('Function-customersApi-getCustomers');

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	// Check principal is an admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			// Find no conditions
			Customer.find({_type: 'Customer'}).select('-password').exec(function (err,customers){
				if (err) {
					res.status(500).json({success: false, message: err});
				} else {
					var completed_customers = [];
					sync.fiber(function () {
						for (var i = 0; i < customers.length; i++) {
							var customer_obj = customers[i].toObject();

							var cc_id = customer_obj.credit_card_id;

							var credit_card = sync.await(CreditCard.findById(cc_id, sync.defer()));
							if(credit_card) {
								customer_obj['credit_card'] = credit_card;
							} else {
								customer_obj['credit_card'] = undefined;
							}

							completed_customers.push(customer_obj);
						}

						return completed_customers;				
					}, function (err, data) {
						if(err) {
							res.sendStatus(500);
							return;
						} else {
							res.status(200).json(completed_customers);
						}
					});
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
	var _timeWindow = customer.timeWindow;

	// Server validation
	var pass = CustomerService.checkFieldsCorrect(_name, _surname, _email, _password, _coordinates, _address, _country, _city, _phone, _timeWindow);

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
			phone: _phone,
			timeWindow: _timeWindow
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
		if(!req.body.customer_id) {
			res.sendStatus(503);
			return;
		}

		credit_card_api.newCreditCard(cc, 
			function (errors, saved) {
				if(errors) {
					res.status(500).json({success: false, message: errors});
				} else {
					Customer.findByIdAndUpdate(req.body.customer_id, { $set : { credit_card: saved.id } }, function (err, customer) {
						if(err) {
							CreditCard.find(saved.id).remove().exec();
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
							phone: req.body.phone,
							timeWindow: req.body.timeWindow}
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

	CustomerService.getPrincipalCustomer(cookie, req.app.get('superSecret'), function (customer) {
		if(!customer) {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		} else {
			if(customer.credit_card_id) {
				CreditCard.findOne({_id: customer.credit_card_id},
					function(err, credit_card){
						if(err) {
							res.status(404).send({
								success: false
							});
						} else {
							res.status(200).json(credit_card);
						}
				})
			} else {
				// empty credit card
				res.status(200).json(null);
			}
		}
	});
};

exports.getMyRecommendations = function (req, res) {
	CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (customer) {
		if(customer) {
			request(
				{
					uri : 'http://localhost:3030/api/recommendations/' + customer.id,
					json : true
				}, function (error, response, body) {
					if (error || response.statusCode == 500 || response.statusCode == 204
						|| response.statusCode == 404) {
						SocialMediaService.socialMediaRecommendations( function (products) {
							if(products) {
								res.status(200).json(products);
							} else {
								res.sendStatus(500);
							}
						});
					} else {
						res.status(200).json(body);
					}
				}
			);
		} else {
			SocialMediaService.socialMediaRecommendations( function (products) {
				if(products) {
					res.status(200).json(products);
				} else {
					res.sendStatus(500);
				}
			});
		}
	});
};

exports.getMyPurchasesRules = function (req, res) {
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='admin' || role=='supplier') {
			CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (customer) {
				if(!customer) {
					res.status(403).json({success: false, message: "Doesnt have permission"});
				} else {
					PurchasingRule.find({customer_id : customer.id}, function (err, rules) {
						if(err) {
							console.log(err);
							res.sendStatus(500);
						} else {
							var completed_rules = [];

							sync.fiber(function () {
								for(var i = 0; i < rules.length; i++) {
									var rule_obj = rules[i].toObject();

									var provide_id = rule_obj.provide_id;

									var product = sync.await(ProductService.getProductByProvideId(provide_id, sync.defer()));

									if(product) {
										rule_obj['product_name'] = product.name;
										rule_obj['product_id'] = product.id;
									} else {
										rule_obj['product_name'] = undefined;
										rule_obj['product_id'] = undefined;
									}

									completed_rules.push(rule_obj);
								}

								return completed_rules;			
							}, function (err, data) {
								if(err) {
									console.log(err);
									res.sendStatus(500);
								} else {
									res.status(200).json(data);
								}
							});
						}
					});
				}
			});
		} else {
			res.status(401).json({success: false, message: "Doesnt have permission"});
		}
	});
};
var Customer = require('../models/customer'),
	credit_card_api = require('./credit_card_api')
	CreditCard = require('../models/credit_card'),
	Actor = require('../models/actor'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	crypto = require('crypto'),//Necesario para encriptacion por MD5	
	db_utils = require('./db_utils'),
	jwt = require('jsonwebtoken');


exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	console.log('Function-customersApi-getCustomer -- _email:'+_email);
	

	Customer.findOne({email:_email}, function(err,customer){
		if(err){
			res.status(500).json({success: false, message: err});
		}
		else{
			res.status(200).json(customer);
		}
	});
};

// Devuelve si el usuario es customer
exports.isCustomer = function(req, res) {
	var _id = req.params.id;
	console.log('Function-customersApi-isCustomer -- _id:'+_id);


	Customer.findbyId( _id, function(err,user){
		if(err){
			res.status(500).json({success: false, message: err});
		}
		else{
			if (user._type == 'Customer') {
				res.status(200).json(true);
			} else {
				res.status(200).json(false);
			}			
		}
	});
};

// Devuelve todos los clientes (sin contraseña)
exports.getCustomers = function (req, res) {
	console.log('Function-productsApi-getCustomers');

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check principal is an admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			//Find sin condiciones
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
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});
};

exports.newCustomer = function (customer, callback) {
	console.log('Function-customersApi-newCustomer');

	//Guardar la entrada de datos en variables
	var _name = customer.name;
	var _surname = customer.surname;
	var _email = customer.email;
	var _password = customer.password;
	var _coordinates = customer.coordinates;
	var _address = customer.address;
	var _country = customer.country;
	var _city = customer.city;
	var _phone = customer.phone;

	//TODO Chequear que los campos son correctos
	
	var md5Password = crypto.createHash('md5').update(_password).digest("hex");

	var newCustomer = new Customer({
		name: _name,
		surname: _surname,
		email: _email,
		password: md5Password,
		coordinates: _coordinates,
		credit_card: "",
		address: _address,
		country: _country,
		city: _city,
		phone: _phone
	});

	newCustomer.save(function (err) {
		callback(db_utils.handleInsertErrors(err));
	});

	return;
};

exports.updateCC = function(req, res){
	console.log('Function-customersApi-updateCC');



	var cc = new CreditCard({
		holderName : req.body.cc.holderName,
		number : req.body.cc.number,
		expirationMonth: req.body.cc.expirationMonth,
		expirationYear: req.body.cc.expirationYear,
		cvcCode: req.body.cc.cvcCode,
	});


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
						}
					});
					res.status(200).json({success: true});
				}
			}
		);
	} else {
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
						res.status(401).json({success: false, message: 'Doesnt have permission'});
					}
				});
			} else {
				res.status(401).json({success: false, message: 'Doesnt have permission'});
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
				      			res.status(500).json({success: false, message: error});
				      		} else {
				      			res.status(200).json({success: true});
				      		}
				    	});
				} else {
					res.status(401).json({success: false, message: 'Doesnt have permission'});
				}
			});
		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
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
					res.status(401).json({success: false, message: 'Doesnt have permission'});
				}
			});
		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});
};

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
								res.status(401).send({
									success: false
								});
							} else {
								// Check is customer
								ActorService.getUserRole(req.cookies.session, req.app.get('superSecret'), function (role) {
									if (role=='customer') {
										// Posible that credit card is null
										if(customer.credit_card) {
											CreditCard.findOne({_id: customer.credit_card},
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
											res.status(200).json({});
										}
									} else {
										res.status(401).send({
											success: false
										});
									}
								});
							}
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

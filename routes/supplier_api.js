var db_utils = require('./db_utils'),
	Supplier = require('../models/supplier'),
	Provide = require('../models/provide'),
	ActorService = require('./services/service_actors'),
	SupplierService = require('./services/service_suppliers'),
	CustomerService = require('./services/service_customers'),
	Reputation = require('../models/reputation');

//Devuelve un nombre de un supplier
exports.getSupplierName = function (req, res) {
	var _code = req.params.id;
	console.log('GET /api/supplierName/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' | role=='supplier') {
			SupplierService.getName(_code, function (err, supplier) {
				if(err){
					console.log('---ERROR finding Supplier: '+_code+' message: '+err);
					res.status(500).json({success: false, message: errors});
				}else{
					//console.log(supplier);
					res.status(200).json(supplier.name);
				}
			});
		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});
};

// Returns supplier object of principal
exports.getSupplierPrincipal = function (req, res) {
	console.log('GET /api/supplier/principal')

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			if (role=='supplier') {
				SupplierService.getPrincipalSupplier(cookie, jwtKey, function (supplier) {
					if (supplier) {
						res.status(200).json(supplier);
					} else {
						res.status(403).json({success: false, message: "Doesn't have permissions"});
					}
				});
			} else {
				res.status(403).json({success: false, message: "Doesn't have permissions"});
			}
		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});
};

// Update a supplier with a new/edited rating
exports.updateSupplierRating = function (req, res) {
	var provide_id = req.body.provide_id;
	var rating_value = req.body.rating;

	CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == null) {
			res.status(403).json({success: false, message: "Doesn't have permission"});
			return;
		} else {
			SupplierService.userHasPurchased(req.cookies.session, req.app.get('superSecret'), provide_id, function (response) {
				if(!response) {
					res.sendStatus(401)
					return;
				}
				Provide.findOne( { _id : provide_id, deleted: false }, function (err, provide) {
					if(err || !provide) {
						res.sendStatus(503);
						return;
					}
					Reputation.findOne({ customer_id : user.id, supplier_id : provide.supplier_id }, function (err, reputation) {
						if(err) {
							res.sendStatus(503);
							return;
						} else {
							if(reputation) {
								// Reputation found: Update
								Reputation.findByIdAndUpdate(reputation.id, { $set : { value : rating_value } }, function (err, updated) {
									if (err) {
										res.sendStatus(503);
										return;
									} else {
										res.sendStatus(200);
									}
								});
							} else {
								// Rate not found: Create new one
								var new_reputation = new Reputation({
									value: rating_value,
									supplier_id : provide.supplier_id,
									customer_id : user.id
								});

								Reputation.save(function (err) {
									if (err) {
										res.sendStatus(503);
										return;
									} else {
										res.sendStatus(200);
									}
								});
							}
						}
					});
				});
			});
		}
	});
};

//Creates a provide for the current logged supplier to the received product
exports.provideProduct = function (req, res) {
	var product_id = req.body.product_id;
	var price = req.body.price;
	//Truncates the number to almost two decimal values
	price = Number(price.toString().match(/^\d+(?:\.\d{0,2})?/))

	SupplierService.getPrincipalSupplier(req.cookies.session, req.app.get('superSecret'),
		function (supplier) {
			if(supplier == null) {
				res.sendStatus(401);
				return;
			}

			if(product_id == undefined || price == undefined) {
				res.sendStatus(503);
				return;
			}

			Provide.findOne({ product_id: product_id, supplier_id : supplier.id, deleted: false }, function (err, provide) {
				if(err){
					res.sendStatus(500);
					return;
				}
				if(provide) {
					res.sendStatus(500);
					return;
				}
				var newProvide = new Provide({
					price : price,
					deleted : false,
					product_id : product_id,
					supplier_id : supplier.id
				});

				newProvide.save(function (err) {
					if(err){
						res.sendStatus(500);
						return;
					}

					res.sendStatus(200);
				});
			});
		}
	);
};

//Checks if the logged supplier already provides the product
exports.checkProvides = function(req, res) {
	var product_id = req.body.product_id;

	SupplierService.getPrincipalSupplier(req.cookies.session, req.app.get('superSecret'),
		function (supplier) {
			if(supplier == null) {
				res.status(200).json({ 'provides' : false });
				return;
			}

			if(product_id == undefined) {
				res.sendStatus(500);
			}

			Provide.findOne( {product_id: product_id, supplier_id : supplier.id, deleted: false }, function (err, provide) {
				if (err) {
					res.sendStatus(500);
					return;
				}

				if(!provide) {
					res.status(200).json({ 'provides' : false });
				} else {
					res.status(200).json({ 'provides' : true });
				}
			})
		}
	);
}

// Returns a supplier by its email. ONLY FOR ADMINS
exports.getSupplierByEmail = function (req, res) {
	var email = req.params.email;
	console.log('Function-productsApi-getCustomerByEmail -- email: ' + email);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='supplier' || role=='admin') {
			if (role=='admin') {
				Supplier.findOne({email: email, _type: 'Supplier'}).exec (function (err, supplier) {
					if (err) {
						// Internal server error
						res.status(500).json({success: false});
					} else {
						
						res.status(200).json(supplier);
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
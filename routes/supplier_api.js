var db_utils = require('./db_utils'),
	Supplier = require('../models/supplier'),
	Provide = require('../models/provide'),
	ActorService = require('./services/service_actors'),
	SupplierService = require('./services/service_suppliers'),
	CustomerService = require('./services/service_customers'),
	Reputation = require('../models/reputation');

// Returns the name of a supplier identified by id
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
				Provide.findOne( { _id : provide_id}, function (err, provide) {
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
									rate: rating_value,
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
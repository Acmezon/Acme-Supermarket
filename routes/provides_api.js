var db_utils = require('./db_utils'),
	Provide = require('../models/provide'),
	Supplier = require('../models/supplier'),
	SupplierService = require('./services/service_suppliers'),
	ReputationService = require('./services/service_reputation'),
	PurchasingRuleService = require('./services/service_purchasing_rules'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	Reputation = require('../models/reputation'),
	async = require('async');

// Returns a provides list by product id. Includes the supplier name.
exports.getProvidesByProductId = function(req, res) {
	var _code = req.params.id;

	console.log('GET /api/providesByProductId/'+_code)
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			// Get product's provides
			Provide.find({product_id: _code, deleted: false },function (err,provides){
				if(err){
					console.log('---ERROR finding Provides with  product_id: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					var final_provides = [];
					// For each provide
					async.each(provides, function (provide, callback) {
						var provide_obj = provide.toObject();
						//Get and store the supplier name
						SupplierService.getName(provide.supplier_id, function (err, supplier) {
							if(err) {
								console.log(err);
								res.sendStatus(500);
							} else {
								provide_obj['supplierName'] = supplier.name;
								//Get and store the supplier average reputation
								ReputationService.averageReputation(supplier.id, function (err, results) {
									if(err){
										console.log(err);
										res.sendStatus(500);
									}

									if(results.length < 1) {
										provide_obj['reputation'] = 0;
									} else {
										provide_obj['reputation'] = Math.floor(results[0].avg);
									}
									
									SupplierService.userHasPurchased(cookie, jwtKey, provide.id, function (hasPurchased) {
										provide_obj['userHasPurchased'] = hasPurchased;
										
										PurchasingRuleService.customerHasRule(cookie, jwtKey, provide.id, function (hasRule) {
											provide_obj['customerHasRule'] = hasRule;

											final_provides.push(provide_obj);
											callback();
										});
									});
								});
							}
						});
					}, function (err) {
						if(err){
							console.log(err);
							res.sendStatus(500);
						}

						res.status(200).json(final_provides);
					});
				}
			});
		} else {
			res.sendStatus(401);
		}
	});
};

// Returns a provide object of supplier for product identified by id
exports.getSupplierProvidesByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/provide/bysupplier/byproduct/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			SupplierService.getPrincipalSupplier(cookie, jwtKey, function (supplier) {
				if (supplier) {

					Provide.findOne({product_id: _code, supplier_id: supplier._id, deleted: false}, function(err,provide){
						if(err){
							// Internal Server Error
							res.status(500).json({success: false, message: err});
						}else{
							//console.log(provide);
							res.status(200).json(provide);
						}
					});

				} else {
					// Principal supplier not found in DB
					res.status(403).json({success: false, message: "Doesn't have permissions"});
				}
			});
		} else {
			// Not authenticated
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});
}

// Deletes a supplier's provide for product identified by id
exports.deleteSupplierProvidesByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/provide/bysupplier/byproduct/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			SupplierService.getPrincipalSupplier(cookie, jwtKey, function (supplier) {
				if (supplier) {

					Provide.findOne({product_id: _code, supplier_id: supplier._id, deleted : false}, function (err, provide){
						if(err || !provide){
							// Internal Server Error
							res.status(500).json({success: false, message: err});
						}else{
							Provide.findByIdAndUpdate(provide.id, { $set : { deleted: true } }, function (err) {
								if (err) {
									res.status(500).json({success: false, message: err});
								} else {
									ReputationService.deleteAllByProvide(provide, function (done) {
										if (done) {
											PurchasingRuleService.deleteAllByProvide(provide, function (done) {
												if (done) {
													res.status(200).json({success: true});
												} else {
													res.status(500).json({success: false})
												}
											});
										} else {
											res.status(500).json({success: false})
										}
									});
									
								}
							});
						}
					});
					
				} else {
					// Principal supplier not found in DB
					res.status(403).json({success: false, message: "Doesn't have permissions"});
				}
			});
		} else {
			// Not authenticated
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});
}

// returns a provide identified by id
exports.getProvide = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/provide/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			Provide.findById( _code,function(err,provide){
				if(err){
					console.log('---ERROR finding Provide: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(provide);
					res.status(200).json(provide);
				}
			});
		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});
};

exports.getExistingProvide = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/existingProvide/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			Provide.findOne( {_id : _code, deleted : false },function(err,provide){
				if(err || !provide){
					console.log('---ERROR finding Provide: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(provide);
					res.status(200).json(provide);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesn't have permission"});
		}
	});
};

// Update a supplier with a new/edited rating
exports.updateProvideRating = function (req, res) {
	var provide_id = req.body.provide_id;
	var rating_value = req.body.rating;

	if(provide_id == undefined || rating_value == undefined) {
		res.sendStatus(500);
		return;
	}

	CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == null) {
			res.status(403).json({success: false, message: "Doesn't have permission"});
			return;
		} else {
			ReputationService.saveReputationForCustomer(req.cookies.session, req.app.get('superSecret'), user.id, provide_id, rating_value, function (err, saved) {
				if(err) {
					console.log(err.message);
					res.sendStatus(parseInt(err.code));
				} else {
					res.sendStatus(200);
				}
			});
		}
	});
};

// Administrator creates provide
exports.adminProvide = function (req, res) {
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	var price = req.body.price,
		supplier_id = req.body.supplier_id,
		product_id = req.body.product_id;

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Supplier.findById(supplier_id, function (err, supplier) {
					if (err){
						res.status(500).json({success: false})
					} else {
						if (supplier) {
							if (supplier._type=='Supplier') {
								Provide.findOne({product_id: product_id, supplier_id: supplier_id, deleted: false}).exec (function (err, provide) {
									if (err) {
										res.status(500).json({success: false})
									} else {
										if (provide) {
											// FOUND provide
											Provide.update({_id: provide._id}, {$set: {price: price}}, function (err, provideSaved) {
												if (err) {
													res.status(500).json({success: false});
												} else {
													res.status(200).json(provideSaved);
												}
											});

										} else {
											// NOT FOUND provide
											var newProvide = new Provide({
												supplier_id: supplier_id,
												product_id: product_id,
												price: price,
												deleted: false
											});

											newProvide.save(function (err, provideSaved) {
												if (err) {
													res.status(500).json({success: false});
												} else {
													res.status(200).json(provideSaved);
												}
											});
										}
									}
								});
							} else {
								res.status(500).json({success: false})
							}
						} else {
							res.status(500).json({success: false})
						}
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
}
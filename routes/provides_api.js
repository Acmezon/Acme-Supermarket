var db_utils = require('./db_utils'),
	Provide = require('../models/provide'),
	SupplierService = require('./services/service_suppliers'),
	ReputationService = require('./services/service_reputation'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	async = require('async');

// Devuelve una lista de Provides que tienen un producto con id
exports.getProvidesByProductId = function(req, res) {
	var _code = req.params.id;

	console.log('GET /api/providesByProductId/'+_code)
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' | role=='supplier') {
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

									provide_obj['reputation'] = Math.floor(results[0].avg);
									SupplierService.userHasPurchased(cookie, jwtKey, provide.id, function (hasPurchased) {
										provide_obj['userHasPurchased'] = hasPurchased;
										
										final_provides.push(provide_obj);
										callback();
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

// Returns a supplier object of supplier for product identified by id
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

					Provide.findOne({product_id: _code, supplier_id: supplier._id, deleted : false}, function (err, result){
						if(err || !result){
							// Internal Server Error
							res.status(500).json({success: false, message: err});
						}else{
							Provide.findByIdAndUpdate(result.id, { $set : { deleted: true } }, function (err) {
								if (err) {
									res.status(500).json({success: false, message: err});
								} else {
									res.status(200).json({success: true});
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
	onsole.log('GET /api/existingProvide/'+_code)

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
					Reputation.findOne({ customer_id : user.id, provide_id : provide.id }, function (err, reputation) {
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
									provide_id : provide.id,
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
var Purchase = require('../models/purchase'),
	PurchaseLine = require('../models/purchase_line'),
	CustomerService = require('./services/service_customers'),
	ProvideService = require('./services/service_provides'),
	ActorService = require('./services/service_actors'),
	PurchaseService = require('./services/service_purchase'),
	RecommenderService = require('./services/service_recommender_server'),
	DiscountService = require('./services/service_discounts');

// Returns a purchase identified by id
exports.getPurchase = function (req, res) {
	var _code = req.params.id;
	console.log('Function-purchasesApi-purchase  --  id: ' + _code);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	Purchase.findById(_code, function (err, purchase) {
		if (err || !purchase) {
			console.log('---ERROR finding Purchase: '+_code);
			res.status(500).json({success: false, message: err});
		} else {
			// If customer&purchased OR admin: PASS
			ActorService.getUserRole(cookie, jwtKey, function (role){
				CustomerService.checkHasPurchasedPurchase(cookie, jwtKey, purchase, function (hasPurchased){
					if ( (role=='customer' && hasPurchased) || role=='admin') {
						res.status(200).json(purchase);
					} else {
						res.status(403).json({success: false});
					}
				});
			});
		}
	});
}

// Returns all the purchases of the system, filtered
exports.getPurchasesFiltered = function (req, res) {
	console.log('Function-purchasesApi-purchasesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1,
		customerFilter = parseInt(req.body.customerFilter) || null;


	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='admin') {

				if (customerFilter) {

					Purchase.find({
						customer_id: customerFilter
					}).sort(ord_tuple)
					.skip(pageSize * currentPage)
					.limit(pageSize)
					.exec(function (err, purchases) {
						if (err) {
							// Internal server error
							res.status(500).json({success: false, message: err});
						} else {
							res.status(200).json(purchases);
						}
					});

				} else {

					Purchase.find().sort(ord_tuple)
					.skip(pageSize * currentPage)
					.limit(pageSize)
					.exec(function (err, purchases) {
						if (err) {
							// Internal server error
							res.status(500).json({success: false, message: err});
						} else {
							res.status(200).json(purchases);
						}
					});

				}

			} else {
				// Not admin should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

// Counts all the purchases of the system, filtered
exports.countPurchasesFiltered = function (req, res) {
	console.log('Function-purchasesApi-countPurchasesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1,
		customerFilter = parseInt(req.body.customerFilter) || null;

	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='admin') {

				if (customerFilter) {

					Purchase.count({
						customer_id: customerFilter
					}).exec(function (err, number) {
						if (err) {
							// Internal server error
							res.status(500).json({success: false, message: err});
						} else {
							res.status(200).json(number);
						}
					});

				} else {

					Purchase.count()
					.exec(function (err, number) {
						if (err) {
							// Internal server error
							res.status(500).json({success: false, message: err});
						} else {
							res.status(200).json(number);
						}
					});

				}

			} else {
				// Not admin should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

// Returns principal's purchases, filtered
exports.getMyPurchasesFiltered = function (req, res) {
	console.log('Function-purchasesApi-myPurchasesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1;

	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='customer') {
				CustomerService.getPrincipalCustomer(cookie, jwtKey, function (customer) {
					if (customer) {

						Purchase.find({
							customer_id: customer._id
						}).sort(ord_tuple)
						.skip(pageSize * currentPage)
						.limit(pageSize)
						.exec(function (err, purchases) {
							if (err) {
								// Internal server error
								res.status(500).json({success: false, message: err});
							} else {
								res.status(200).json(purchases);
							}
						});

					} else {
						// No customer found by principal
						res.status(403).json({success: false});
					}
				});

			} else {
				// Non customer should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

// Counts principal's purchases
exports.countMyPurchasesFiltered = function (req, res) {
	console.log('Function-purchasesApi-countPurchasesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1;

	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='customer') {
				CustomerService.getPrincipalCustomer(cookie, jwtKey, function (customer) {
					if (customer) {

						Purchase.count({
							customer_id: customer._id
						}).exec(function (err, number) {
							if (err) {
								// Internal server error
								res.status(500).json({success: false, message: err});
							} else {
								res.status(200).json(number);
							}
						});

					} else {
						// No customer found by principal
						res.status(403).json({success: false});
					}
				});

			} else {
				// Non customer should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

exports.purchase = function (req, res) {
	console.log('Function-purchasesApi-purchaseProcess');
	
	var cookie = undefined;
	try {
		cookie = JSON.parse(req.cookies.shoppingcart);
	} catch (error) {
		res.status(500).send({success: false});
		return;
	}

	var session = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	var billingMethod = parseInt(req.body.billingMethod);
	// Optional param
	var discountCode = req.body.discountCode;

	if (billingMethod!=1 && billingMethod!=2 && billingMethod!=3) {
		console.log(1)
		res.status(500).send({success: false});
		return;
	} else {

		PurchaseService.purchaseStandard(discountCode, billingMethod, cookie, session, jwtKey, function (code, purchase) {
			switch(code) {
				case 401:
					res.status(401).send({success: false});
					break;
				case 403:
					res.status(403).send({success: false});
					break;
				case 500:
					res.status(500).send({success: false});
					break;
				case 503:
					res.status(503).send({success: false, message: 'Product by supplier no longer exists'});
					break;
				case 200:
					res.status(200).send(purchase);
					break;
			}
		});
	}
	
};

exports.purchaseAdmin = function (req, res) {
	console.log('Function-purchasesApi-purchaseProcessAdmin');
	var session = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	var billingMethod = parseInt(req.body.billingMethod) || -1,
		customer_id = req.body.customer_id,
		shoppingcart = req.body.shoppingcart,
		discountCode = req.body.discountCode;

	if (billingMethod!=1 && billingMethod!=3 && billingMethod!=3) {
		res.status(500).send({success: false});
		return;
	} else {

		ActorService.getUserRole(session, jwtKey, function (role) {
			if (role=='customer' || role=='supplier' || role=='admin') {
				if (role=='admin') {
					if (billingMethod != 1 && billingMethod != 2 && billingMethod != 3) {
						// Error bad params
						res.status(503).send({success: false});
					} else {
						// CONTINUE
						PurchaseService.purchaseAdmin(customer_id, billingMethod, shoppingcart, discountCode, session, jwtKey, function (code, purchase) {
							switch(code) {
								case 401:
									res.status(401).send({success: false});
									break;
								case 403:
									res.status(403).send({success: false});
									break;
								case 500:
									res.status(500).send({success: false});
									break;
								case 503:
									res.status(503).send({success: false, message: 'Product by supplier no longer exists'});
									break;
								case 200:
									res.status(200).send(purchase);
									break;
							}
						});
					}
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
}

// Delete a purchase
exports.deletePurchase = function (req, res) {
	var _code = req.body.id;
	console.log('Function-purchasesApi-deletePurchase -- id: ' + _code);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			if (role=='admin') {
				Purchase.remove({ _id: _code }, function(err) {
					if (!err) {
						res.status(200).json({success: true});
					} else {
						// Internal server error
						res.status(500).json({success: false, message: err});
					}
				});
			} else {
				// Error not an admin
				res.status(403).send({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).send({success: false});
		}
	});
};

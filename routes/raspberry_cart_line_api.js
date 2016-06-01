var RaspberryCartLine = require('../models/raspberry_cart_line'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./service/service_customers'),
	ProductService = require('./service/service_products'),
	ProvideService = require('./service/service_provides'),
	Provide = require('../models/provide');

// Get all raspberry cart lines from principal customer
exports.getRaspberryCartLinesFromPrincipal = function(req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	console.log('Function-raspberryCartLinesApi-getFromPrincipal');

	// Check is authenticated
	ActorService.getUserRole(cookie, jwtKey, function(role) {
		if (role == 'customer' || role == 'admin' || role == 'supplier') {
			// Check principal is customer
			if (role == 'customer') {
				CustomerService.getPrincipalCustomer(cookie, jwtKey, function (customer) {
					if (customer) {
						RaspberryCartLine.find({customer_id: customer._id})
						.exec(function (err, raspberryCartLines) {
							if (err) {
								res.status(500).json({success: false});
							} else {
								res.status(200).json(raspberryCartLines);
							}
						});
					} else {
						res.sendStatus(503);
					}
				});
			} else {
				res.status(403).json({success: false, message: "Doesnt have permission"})
			}
		} else {
			res.status(401).json({success: false, message: "Doesnt have permission"})
		}
	});

// Save a collection of Raspberry Cart Lines
exports.saveRaspberryCart = function(req, res) {
	console.log('Function-raspberryCartLinesApi-saveRaspberryCart');
	var body = req.body;
	CustomerService.getCustomerFromCredentials (req.body.email, req.body.password, function(customer) {
		if (customer) {
			async.each(req.body.barcodes, function (barcode, callback) {
				ProductService.getProductByBarcode(barcode.code, function (product) {
					if (product){
						ProvideService.getMostFrequentlyPurchased(customer._id, product._id, function (provide) {
							if (provide) {
								rasp_line = RaspberryCartLine({
									provide_id: provide._id,
									quantity: barcode.quantity,
									customer_id: customer._id
								});
								rasp_line.save(function (err) {
									callback();
								});
							} else {
								callback(500);
							}
						});
					} else {
						callback(500);
					}
				});
			}, function(err) {
				if (err) {
					res.status(parseInt(err)).json({success: false});
				} else {
					async.each(req.body.names, function (name.text, callback) {
						ProductService.getProductsFiltered(
							'name', 1, 0, 1000, -1, 0, 0, name, false, 
							function (err, products) {
								if (err) {
									callback(500);
								} else {
									var available_products = [];
									async.each(products, function(product, _callback) {
										Provide.count({product_id: product._id, deleted: false})
										.exec(function (err, n_provides) {
											if (err) {
												_callback(500);
											} else {
												if (n_provides>0) {
													available_products.push(product)
												}
												_callback();
											}
										});
									}, function (err) {
										if (err) {
											callback(err);
										} else {
											if (available_products) {
												var product = available_products[0];
												ProvideService.getMostFrequentlyPurchased(customer._id, product._id, function (provide) {
													if (provide) {
														rasp_line = RaspberryCartLine({
															provide_id: provide._id,
															quantity: name.quantity,
															customer_id: customer._id
														});
														rasp_line.save(function (err) {
															callback();
														});
													} else {
														callback(500);
													}
												});
											} else {
												callback(500);
											}
										}
									});
								}
						})
					}, function(err) {
						if (err) {
							res.status(parseInt(err)).json({success: false});
						} else {
							res.sendStatus(200);
						}
					});
				}
			});
		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});
}
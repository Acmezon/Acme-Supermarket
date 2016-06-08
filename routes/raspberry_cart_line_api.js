var RaspberryCartLine = require('../models/raspberry_cart_line'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	ProductService = require('./services/service_products'),
	ProvideService = require('./services/service_provides'),
	Provide = require('../models/provide'),
	RaspberryCartLineService = require('./services/service_raspberry_cart_lines'),
	async = require('async');

exports.saveRaspberryCart = function(req, res){
	/* PARAMS
		email
		password (MD5)
		products : [{'_id', 'quantity'}]
	*/
	console.log('Function-raspberryCartLinesApi-saveRaspberryCart');
	CustomerService.getCustomerFromCredentials(req.body.email, req.body.password, function (customer) {
		if (customer) {
			async.each(JSON.parse(req.body.products), function (product, callback) {
				ProvideService.getMostFrequentlyPurchased(customer._id, product._id, function (provide) {
					if (provide) {
						rasp_line = RaspberryCartLine({
							provide_id: provide._id,
							quantity: product.quantity,
							customer_id: customer._id
						});
						RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
							callback();
						})
					} else {
						ProvideService.getCheapestProvideOfProduct(product._id, function (err, provide) {
							if (err) {
								callback(err);
							} else {
								rasp_line = RaspberryCartLine({
									provide_id: provide._id,
									quantity: product.quantity,
									customer_id: customer._id
								});
								RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
									callback();
								})
							}
						});
					}
				});
			}, function (err){
				if (err) {
					res.status(500).json({success: false, message: err});
				} else {
					res.sendStatus(200)
				}
			});
		} else {
			res.status(500).json({success: false, message: "Authentication failed"});
		}
	});
}


// Save a collection of Raspberry Cart Lines
exports.saveRaspberryCart = function(req, res) {
	console.log('Function-raspberryCartLinesApi-saveRaspberryCart');
	var body = req.body;
	CustomerService.getCustomerFromCredentials (req.body.email, req.body.password, function(customer) {
		if (customer) {
			async.each(JSON.parse(req.body.product_ids), function (product_id, callback) {
				ProvideService.getMostFrequentlyPurchased(customer._id, product_id, function (provide) {
					if (provide) {
						rasp_line = RaspberryCartLine({
							provide_id: provide._id,
							quantity: barcode.quantity,
							customer_id: customer._id
						});
						RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
							callback();
						})
					} else {
						ProvideService.getCheapestProvideOfProduct(product_id, function (err, provide) {
							if (err) {
								callback(err);
							} else {
								rasp_line = RaspberryCartLine({
									provide_id: provide._id,
									quantity: barcode.quantity,
									customer_id: customer._id
								});
								RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
									callback();
								})
							}
						});
					}
				});
			}, function(err) {
				if (err) {
					res.status(parseInt(err)).json({success: false});
				} else {
					async.each(JSON.parse(req.body.names), function (name, callback) {
						ProductService.getProductsFiltered(
							'name', 1, 0, 1000, -1, -1, 0, 5, name.text, false, 
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
														RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
															callback();
														})
													} else {
														ProvideService.getCheapestProvideOfProduct(product._id, function (err, provide) {
															if (err) {
																callback(err);
															} else {
																rasp_line = RaspberryCartLine({
																	provide_id: provide._id,
																	quantity: name.quantity,
																	customer_id: customer._id
																});
																RaspberryCartLineService.saveRaspberryCartLine(rasp_line, function (err) {
																	callback();
																})
															}
														});
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

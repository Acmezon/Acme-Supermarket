var db_utils = require('./db_utils');
var Rate = require('../models/rate'),
	Customer = require('../models/customer'),
	ProductService = require('./services/service_products'),
	CustomerService = require('./services/service_customers'),
	ActorService = require('./services/service_actors'),
	RecommenderService = require('./services/service_recommender_server');

// Returns the avg rating of a product by id
exports.getAverageRatingByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/getAverageRatingByProductId/'+_code)

	Rate.find({product_id: _code},function (err,rates){
		if(err > 0){
			console.log('---ERROR finding Rates with  product_id: '+_code+' message: '+ err);
			res.status(500).json({success: false, message: err});
		}else{
			var total = 0;
			for(var i = 0; i < rates.length; i++) {
			    total += rates[i].value;
			}
			var rating = total / rates.length;
			res.status(200).json(rating);
		}
	});
}

// Update/Create a rating by an admin for a customer
exports.manageRating = function (req, res) {
	var customer_id = parseInt(req.body.customer_id) || -1,
		product_id = parseInt(req.body.product_id) || -1,
		value = parseInt(req.body.value) || -1;

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			if (role=='admin') {
				Customer.findOne({_id: customer_id, _type: 'Customer'}).exec (function (err, customer) {
					if (err) {
						// Internal server error
						res.status(500).json({success: false});
					} else {
						if (customer) {
							CustomerService.checkPurchasing(customer, product_id, function(response) {
								if (response) {
									Rate.findOne({
										customer_id: customer._id,
										product_id: product_id
									}, function(err, rate) {
										if (err) {
											res.status(500).json({success: false});
										} else {
											if (rate) {
												// Rate found: Update
												Rate.update({_id:rate._id}, {
													$set: {
														'value': value
													}
												}, function(err, updated) {
													if (err) {
														res.status(500).json({success: false});
													} else {
														// Update average rating and recalculate recommendations
														ProductService.updateAverageRating(product_id, function(success) {
															if (!success) {
																console.log("Ratings not updated");
																res.status(500);
															} else {
																RecommenderService.recommendRates(customer_id, function(err, response) {
																	if (err || response.statusCode == 500) {
																		console.log("No recommendation updated")
																	}
																	
																});
																res.status(200);
															}
														});
													}
												});
											} else {
												// Rate not found: Create new one
												var new_rate = new Rate({
													value: value,
													product_id: product_id,
													customer_id: customer_id
												});

												new_rate.save(function(err) {
													if (err) {
														res.status(503);
													} else {
														ProductService.updateAverageRating(product_id, function(success) {
															if (!success) {
																console.log("Ratings not updated");
																res.status(500);
															} else {
																RecommenderService.recommendRates(customer_id, function(err, response) {
																	if (err || response.statusCode == 500) {
																		console.log("No recommendation updated")
																	}
																	res.status(200);
																});
															}
														});
													}
												});
											}
										}
									});



								} else {
									res.status(503).json({success: false, message: 'Customer hasnt purchased'});
								}
							});
						} else {
							res.status(503).json({success: false, message: 'Customer not found'});
						}
					}
				});
			} else {
				res.status(403).json({success: false})
			}
		} else {
			res.status(401).json({success: false});
		}
	});
}
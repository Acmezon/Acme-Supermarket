var CustomerService = require('./service_customers'),
	ProductService = require('./service_products'),
	RecommenderService = require('./service_recommender_server'),
	Rate = require('../../models/rate');


exports.rateProductForCustomer = function(customer, product_id, value, callback) {
	CustomerService.checkPurchasing(customer, product_id, function (response) {
		if (!response) {
			callback({ code: 503, message: "The customer has not purchased this product" }, null);
			return;
		} else {
			Rate.findOne({
				customer_id: customer._id,
				product_id: product_id
			}, function (err, rate) {
				if (err) {
					callback({ code: 503, message: "Error while working with the database" }, null);
					return;
				} else {
					if (rate) {
						// Rate found: Update
						Rate.findByIdAndUpdate(rate._id, {
							$set: {
								value: value
							}
						}, function (err, updated) {
							if (err) {
								callback({ code: 503, message: "Error while working with the database" }, null);
								return;
							} else {
								// Update average rating and recalculate recommendations
								ProductService.updateAverageRating(product_id, function (success) {
									if (!success) {
										console.log("Ratings not updated");
										callback({ code: 503, message: "Error while working with the database" }, null);
									} else {
										RecommenderService.recommendRates(customer._id, function (err, response) {
											if (err || response.statusCode == 500) {
												console.log("No recommendations updated");
											}

											callback(null, updated);
											return;
										});
									}
								});
							}
						});
					} else {
						// Rate not found: Create new one
						var new_rate = new Rate({
							value: value,
							product_id: product_id,
							customer_id: customer._id
						});

						new_rate.save(function (err, saved) {
							if (err) {
								callback({ code: 503, message: "Error while working with the database" }, null);
								return;
							} else {
								ProductService.updateAverageRating(product_id, function (success) {
									if (!success) {
										console.log("Ratings not updated");
										callback({ code: 503, message: "Error while working with the database" }, null);
									} else {
										RecommenderService.recommendRates(customer._id, function (err, response) {
											if (err || response.statusCode == 500) {
												console.log("No recommendation updated")
											}

											callback(null, saved);
											return;
										});
									}
								});
							}
						});
					}
				}
			});
		}
	});
}
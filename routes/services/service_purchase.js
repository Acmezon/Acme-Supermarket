var request = require('request'),
	ActorService = require('./service_actors'),
	CustomerService = require('./service_customers'),
	Customer = require('../../models/customer'),
	Purchase = require('../../models/purchase'),
	ProvideService = require('./service_provides'),
	PurchaseLine = require('../../models/purchase_line'),
	RecommenderService = require('./service_recommender_server'),
	DiscountService = require('./service_discounts'),
	sync = require('synchronize');

var storePurchaseInRecommendation = function(customer, product) {
	request.post(
		{
			url:'http://localhost:3030/api/storePurchase', 
			form: {
					customer: customer,
					product : product
				}
		}, function (err,httpResponse,body){
			if(err) {
				return false;
			}

			if(httpResponse.statusCode == 500) {
				console.log("Is 500");
				return false;
			}

			if(httpResponse.statusCode == 200) {
				return true;
			}
		}
	);
}

exports.storePurchaseInRecommendation = storePurchaseInRecommendation;

//Called by the standard purchase method. Performs all the checks and call the purchase method
exports.purchaseStandard = function (discountCode, billingMethod, cookie, session, jwtKey, callback) {
	if (billingMethod != 1 && billingMethod != 2 && billingMethod != 3) {
		// Error bad GET params
		callback(503, null);
	} else {
		ActorService.getUserRole(session, jwtKey, function (role) {
			// CONTINUE
			// Check principal is customer
			if (role=='admin' || role=='customer' || role=='supplier') { 
				CustomerService.getPrincipalCustomer(session, jwtKey, function (customer) {
					if (customer) {
						purchase(discountCode, billingMethod, customer.id, cookie, session, jwtKey, function (code, purchase) {
							callback(code, purchase);
						});
					} else {
						// Error not a customer
						callback(403, null);
					}
				});
			} else {
				callback(401, null);
			}
		});
	}
};

// Called by the admin purchase method. Perform all checks and call the purchase() method
exports.purchaseAdmin = function(customer_id, billingMethod, shoppingcart, discountCode, session, jwtKey, callback) {
	if (billingMethod != 1 && billingMethod != 2 && billingMethod != 3) {
		// Error bad GET params
		callback(503, null);
	} else {
		ActorService.getUserRole(session, jwtKey, function (role) {
			// CONTINUE
			// Check principal is customer
			if (role=='admin' || role=='customer' || role=='supplier') { 
				if (role=='admin') {
					Customer.findOne({_id: customer_id, _type:'Customer'})
					.exec(function (err, customer) {
						if (customer && shoppingcart) {
							if (Object.keys(shoppingcart).length) {
								purchase(discountCode, billingMethod, customer_id, shoppingcart, session, jwtKey, function (code, purchase) {
									callback(code, purchase);
								});
							} else {
								callback(503, null);
							}
						} else {
							callback(500, null);
						}
					});
				} else {
					// Error not an admin
					callback(403, null);
				}
			} else {
				callback(401, null);
			}
		});
	}

};

//Called by the scheduled task for automatic purchasing. Gathers the required parameters and calls the purchase method
exports.purchaseScheduled = function(customer_id, provide_id, quantity, callback) {
	if (!customer_id || !provide_id || !quantity) {
		// Error bad GET params
		callback(new Error("Bad GET params"), null);
	} else {
		// CONTINUE
		// Check if customer exists
		Customer.findOne({_id: customer_id, _type:'Customer'}, function (err, customer) {
			if(err){
				callback(err, null);
				return;
			}

			if (customer) {
				var provide_list = {};
				provide_list[provide_id] = quantity;

				purchase(null, 1, customer.id, provide_list, null, null, function (code, purchase) {
					if(code == 200) {
						callback(null, purchase);
					} else {
						callback(new Error("Error while purchasing product"), null)
					}
				});
			} else {
				// Error not a customer
				callback(new Error("Customer id: " + customer_id + " not corresponding with any customer"), null);
			}
		});
	}
}

//Purchases the requested provide list with the received billing method for the received customer
function purchase(discountCode, billingMethod, customer_id, provide_list, session, jwtKey, callback) {
	var time;
	switch (billingMethod) {
		case 1: 
			time = 5;
			break;
		case 2:
			time = 15;
			break;
		case 3:
			time = 30;
			break;
	}

	if(!provide_list) {
		console.log(1)
		res.sendStatus(500);
		return;
	}

	var day = new Date();
	day.setDate(day.getDate() + time);

	// Create purchase
	var newPurchase = Purchase({
		deliveryDate : day,
		customer_id : customer_id
	});

	// Save it
	newPurchase.save(function (err, newPurchase) {
		if (err){
			// Internal error
			console.log(2)
			callback(500, null);
		} else {
			// CONTINUE
			// For each of the provides in shopping cart
			sync.fiber(function (){
				Object.keys(provide_list).forEach(function (provide_id) {
					var provide = sync.await(ProvideService.getProvideById(provide_id, sync.defer()));
					if (provide) {
						// CONTNUE

						if (discountCode) {
							// DISCOUNT ACTIVATED
							var sub = 0;
							DiscountService.canRedeemCode(session, jwtKey, discountCode, provide.product_id, function (discount) {

								if (discount) {
									sub = (discount.value/100) * provide.price;

									// Create  purchase line with discount
									var newPurchaseLine = PurchaseLine({
										quantity: provide_list[provide_id],
										price: provide.price - sub,
										discounted: true,
										purchase_id: newPurchase._id,
										provide_id: provide._id,
										product_id: provide.product_id
									});
								} else {

									var newPurchaseLine = PurchaseLine({
										quantity: provide_list[provide_id],
										price: provide.price,
										discounted: false,
										purchase_id: newPurchase._id,
										provide_id: provide._id,
										product_id: provide.product_id
									});

								}

								// Save it
								newPurchaseLine.save(function (err) {
									if (err) {
										console.log(3)
										callback(500, null);
									}
								});

								storePurchaseInRecommendation(customer_id, provide.product_id);

							});
						} else {

							// Create  purchase line
							var newPurchaseLine = PurchaseLine({
								quantity: provide_list[provide_id],
								price: provide.price,
								discounted: false,
								purchase_id: newPurchase._id,
								provide_id: provide._id,
								product_id: provide.product_id
							});

							// Save it
							sync.await(newPurchaseLine.save(sync.defer()));

							storePurchaseInRecommendation(customer_id, provide.product_id);
						}


						
					} else {
						// Error: Rollback the purchase saved
						sync.await(Purchase.remove({ _id: newPurchase._id }, sync.defer()));

						// Internal error: Provide no longer exists
						callback(503, null);
					}
				});
				// FINISH LOOP
				// FINISH PURCHASE PROCESS
				// RECALCULATE RECOMMENDATION
				RecommenderService.recommendPurchases(customer_id, function (err, response){
					if(err || response.statusCode == 500) {
						console.log(err);
						console.log("No recommendation updated")
					} else {
						console.log("Recommendations updated")
					}
				});
				callback(200, newPurchase);
			}, function (err, data) {
				if(err) {
					Purchase.remove({ _id: newPurchase._id }, function (save_err) {
						callback(503, null);
					});
				}
			});
		}
	});
}
var request = require('request'),
	CustomerService = require('./service_customers'),
	Customer = require('../../models/customer'),
	Purchase = require('../../models/purchase'),
	ProvideService = require('./service_provides'),
	PurchaseLine = require('../../models/purchase_line'),
	RecommenderService = require('./service_recommender_server'),
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
exports.purchaseStandard = function (billingMethod, cookie, session, jwtKey, callback) {
	if (billingMethod != 1 && billingMethod != 2 && billingMethod != 3) {
		// Error bad GET params
		callback(403, null);
	} else {
		// CONTINUE
		// Check principal is customer
		CustomerService.getPrincipalCustomer(session, jwtKey, function (customer) {
			if (customer) {
				purchase(billingMethod, customer.id, cookie, function (code, purchase) {
					callback(code, purchase);
				});
			} else {
				// Error not a customer
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
		Customer.findById(customer_id, function (err, customer) {
			if(err){
				callback(err, null);
				return;
			}

			if (customer) {
				var provide_list = {};
				provide_list[provide_id] = quantity;

				purchase(1, customer.id, provide_list, function (code, purchase) {
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
function purchase(billingMethod, customer_id, provide_list, callback) {
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
			callback(500, null);
		} else {
			// CONTINUE
			// For each of the provides in shopping cart
			sync.fiber(function (){
				Object.keys(provide_list).forEach(function (provide_id) {
					var provide = sync.await(ProvideService.getProvideById(provide_id, sync.defer()));
					if (provide) {
						// CONTNUE
						// Create  purchase line
						var newPurchaseLine = PurchaseLine({
							quantity: provide_list[provide_id],
							price: provide.price * provide_list[provide_id],
							purchase_id: newPurchase._id,
							provide_id: provide._id,
							product_id: provide.product_id
						});

						// Save it
						sync.await(newPurchaseLine.save(sync.defer()));

						storePurchaseInRecommendation(customer_id, provide.product_id);
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
						console.log(response.statusCode);
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
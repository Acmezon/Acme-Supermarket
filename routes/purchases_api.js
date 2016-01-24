var Purchase = require('../models/purchase'),
	PurchaseLine = require('../models/purchase_line'),
	CustomerService = require('./services/service_customers'),
	ProvideService = require('./services/service_provides'),
	ActorService = require('./services/service_actors'),
	PurchaseService = require('./services/service_purchase');

exports.getPurchasesByCustomerId = function(req, res) {
	var _code = req.params.id;
	console.log('Function-purchasesApi-getPurchasesByCustomerId  --  id: ' + _code);

	Purchase.find({customer_id: id}, function (err, purchases) {
		if (err) {
			res.status(500).json({success: false, message: err});
		} else {
			res.status(200).json(purchases);
		}
	});
}

exports.getPurchase = function (req, res) {
	var _code = req.params.id;
	console.log('Function-purchasesApi-purchase  --  id: ' + _code);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	Purchase.findById(_code, function (err, purchase) {
		if (err) {
			console.log('---ERROR finding Purchase: '+_code);
			res.status(500).json({success: false, message: err});
		} else {
			// If customer&purchased OR admin OR supplier: PASS
			ActorService.getUserRole(cookie, jwtKey, function (role){
				CustomerService.checkHasPurchasedPurchase(cookie, jwtKey, purchase, function (hasPurchased){
					if ( (role=='customer' && hasPurchased) || role=='admin' || role=='supplier') {
						res.status(200).json(purchase);
					} else {
						res.status(403).json({success: false});
					}
				});
			});
		}
	});
}

exports.purchase = function (req, res) {
	console.log('Function-purchasesApi-purchaseProcess');
	var cookie = JSON.parse(req.cookies.shoppingcart);
	var session = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	var billingMethod = parseInt(req.params.billingMethod);


	if (billingMethod != 1 && billingMethod != 2 && billingMethod != 3) {
		// Error bad GET params
		res.status(403).send({success: false});
	} else {
		// CONTINUE
		// Check principal is customer
		CustomerService.getPrincipalCustomer(session, jwtKey, function (customer) {
			if (customer) {

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
					customer_id : customer._id
				});

				// Save it
				newPurchase.save(function (err, newPurchase) {
			  		if (err){
			  			// Internal error
			  			res.status(500).send({success: false});
			  		} else {
			  			// CONTINUE
			  			// For each of the provides in shopping cart
			  			Object.keys(cookie).forEach(function(cookie_id) {
							ProvideService.getProvideById(cookie_id, function (provide) {
								if (provide) {
									// CONTNUE
									// Create  purchase line
									var newPurchaseLine = PurchaseLine({
										quantity: cookie[cookie_id],
										purchase_id: newPurchase._id,
										provide_id: provide._id,
									});

									// Save it
									newPurchaseLine.save(function (err) {
										if (err) {
											res.status(500).send({success: false});
										} else {
											// CONTINUE
											// Next loop: Next provide
										}
									});

									PurchaseService.storePurchaseInRecommendation(customer.id, provide.product_id);
								} else {
									// Internal error: Provide no longer exists
									res.status(503).send({success: false, message: 'Product by supplier no longer exists'});
									// Error: Rollback the purchase saved
									Purchase.remove({ _id: newPurchase._id });

								}
							});
						});
			  			// FINISH LOOP
			  			// FINISH PURCHASE PROCESS
			  			res.status(200).send(newPurchase);
			  		}
				});
			} else {
				// Error not a customer
				res.status(401).send({success: false});
			}
		});
	}
}
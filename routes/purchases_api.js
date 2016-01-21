var Purchase = require('../models/purchase'),
	PurchaseLine = require('../models/purchase_line'),
	CustomerService = require('./services/service_customers'),
	ProvideService = require('./services/service_provides');

exports.purchase = function (req, res) {
	console.log('Function-purchasesApi-purchase');
	var cookie = JSON.parse(req.cookies.shoppingcart);
	var session = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	// Check principal is customer
	CustomerService.getPrincipalCustomer(session, jwtKey, function (customer) {
		if (customer) {
			var newPurchase = Purchase({
				deliveryDate : 0,
				customer_id : customer._id
			});
			Object.keys(cookie).forEach(function(id) {
				ProvideService.getProvideById(id, function (provide) {
					if (provide) {
						var newPurchaseLine = PurchaseLine({
							quantity: cookie[id],
							purchase_id: 0,
							provide_id: provide._id,
						});
						console.log(newPurchaseLine);
					} else {
						res.status(503).send({success: false});
					}
				});
			});
		} else {
			res.status(401).send({success: false});
		}
	});
	

	

}
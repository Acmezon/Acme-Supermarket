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
var RaspberryCartLine = require('../../models/raspberry_cart_line'),
	ActorService = require('./service_actors'),
	CustomerService = require('./service_customers'),
	async = require('async');

// Get all raspberry cart lines from principal customer
exports.getRaspberryCartLinesFromPrincipal = function(cookie, jwtKey, callback) {
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
								callback(500, null)
							} else {
								callback(null, raspberryCartLines)
							}
						});
					} else {
						callback(503, null)
					}
				});
			} else {
				callback(403, null)
			}
		} else {
			callback(401, null)
		}
	});
};

exports.saveRaspberryCartLine = function (new_rasp_cart_line, callback) {
	RaspberryCartLine.findOne({provide_id: new_rasp_cart_line.provide_id, customer_id: new_rasp_cart_line.customer_id})
	.exec (function (err, raspberry_cart_line) {
		if (err) {
			callback(500);
		} else {
			if (raspberry_cart_line) {
				raspberry_cart_line.quantity += new_rasp_cart_line.quantity;
				raspberry_cart_line.save(function (err) {
					if (err) {
						callback(500)
					} else {
						callback();
					}
				})
			} else {
				new_rasp_cart_line.save(function (err) {
					if (err) {
						callback(500)
					} else {
						callback();
					}
				});
			}
		}
	});
}
var CustomerService = require('./service_customers'),
	PurchasingRule = require('../../models/purchasing_rule');

exports.customerHasRule = function(cookie, key, provide_id, callback) {
	CustomerService.getPrincipalCustomer(cookie, key, function (customer) {
		if(!customer) {
			callback(true);
		} else {
			PurchasingRule.find({ customer_id : customer.id, provide_id: provide_id }).limit(1).exec(function (err, results) {
				if(err) {
					callback(true)
				} else {
					callback(results.length > 0);
				}
			});
		}
	});
}

exports.customerIdHasRule = function(customer_id, provide_id, callback) {
	PurchasingRule.find({ customer_id : customer_id, provide_id: provide_id }).limit(1).exec(function (err, results) {
		if(err) {
			callback(true)
		} else {
			callback(results.length > 0);
		}
	});
}

exports.saveRule = function(rule, customer_id, callback) {
	var purchasing_rule = new PurchasingRule({
		startDate: rule.startDate,
		periodicity: rule.periodicity,
		quantity: rule.quantity,
		provide_id: rule.provide_id,
		customer_id: customer_id
	});

	purchasing_rule.save(function (err, saved) {
		if(err) {
			console.log(err);
			callback({code: 503, message: "Error while working with the database"}, null);
		} else {
			callback(null, saved);
		}
	});
}

exports.deleteAllByProvide = function(provide, callback) {
	PurchasingRule.remove({ provide_id: provide._id }, function (err) {
		if (err) {
			callback(false);
		} else {
			callback(true);
		}
	});
}
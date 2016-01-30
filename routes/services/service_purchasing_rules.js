var CustomerService = require('./service_customers'),
	PurchasingRule = require('../../models/purchasing_rule');

exports.customerHasRule = function(cookie, key, provide_id, callback) {
	CustomerService.getPrincipalCustomer(cookie, key, function (customer) {
		if(!customer) {
			callback(false);
		} else {
			PurchasingRule.find({ customer_id : customer.id, provide_id: provide_id }).limit(1).exec(function (err, results) {
				if(err) {
					callback(false)
				} else {
					callback(results.length > 0);
				}
			});
		}
	});
}
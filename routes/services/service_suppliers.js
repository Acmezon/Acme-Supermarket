var Supplier = require('../../models/supplier'),
	Customer = require('../../models/customer'),
	ActorService = require('./service_actors');

//Gets a supplier by its id
exports.getSupplierById = function(id, callback) {
	Supplier.findById(id, function (err, supplier) {
		if (err) {
			callback(null);
		} else {
			callback(supplier);
		}
	});
}

//Gets the supplier name
exports.getName = function(id, callback) {
	Supplier.findById(id, function (err,supplier){
		callback(err, supplier);
	});	
};

exports.userHasPurchased = function (cookie, key, provide_id, callback) {
	ActorService.getPrincipal(cookie, key, function (user) {
		if(user == -1) {
			callback(false);
			return;
		} else {
			Customer.findOne({ email : user[0]}, function (err, customer) {
				if(err) {
					callback(false);
					return;
				} else {
					CustomerService.checkHasPurchasedProvide(customer.id, provide_id, function (response){
						callback(response);
					});
					return;
				}
			});
		}
	});
};
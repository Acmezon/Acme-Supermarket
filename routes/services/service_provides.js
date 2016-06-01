var Provide = require('../../models/provide'),
	CustomerService = require('./service_customers'),
	PurchaseLineService = require('./service_purchase_lines'),
	db_utils = require('../db_utils');

// Returns a provide object by id
exports.getProvideById = function(provide_id, callback) {
	Provide.findById(provide_id, function (error, provide) {
		if (error) {
			callback(err, null)
		} else {
			callback(null, provide);
		}
	});
}

// Returns IDs of the provides purchased by a customer.
// With Repetition
var getProvidesPurchasedByCustomerProduct = function (customer_id, product_id, callback) {
	var result = [];
	PurchaseLineService.getPurchaseLinesByCustomerProduct(customer_id, product_id, function (purchase_lines) {
		if (purchase_lines) {
			async.each(purchase_lines, function(purchase_line, _callback) {
				Provide.find(purchase_line.provide_id)
				.exec(function (err, provide) {
					if (err) {
						_callback(500);
					} else {
						if (!provide.deleted) {
							result.push(provide._id);
						}
						_callback();
					}
				});
			} , function(err) {
				if (err) {
					callback(null);
				} else {
					callback(result);
				}
			});
		} else {
			callback(null);
		}
	});
}

exports.getProvidesPurchasedByCustomerProduct = getProvidesPurchasedByCustomerProduct;

// Returns the actually available, most frequently purchased provide by a customer, 
var getMostFrequentlyPurchased = function(customer_id, product_id, callback) {
	getProvidesPurchasedByCustomerProduct(customer_id, product_id, function (provides) {
		if (provides) {
			var provide = db_utils.sortByFrequency(provides).reverse()[0];
			callback(provide);
		} else {
			callback(null);
		}
	});	
}
exports.getMostFrequentlyPurchased = getMostFrequentlyPurchased;

// Returns the cheapest provide of a product
var getCheapestProvideOfProduct = function(product_id, callback) {
	Provide.find({product_id: product_id, deleted: false}).sort({price: 1}).limit(1)
	.exec(function (err, provides) {
		if (err) {
			callback(500, null);
		} else {
			if (provides) {
				callback(null, provides[0])
			} else {
				callback(null, null)
			}
		}
	});
};

exports.getCheapestProvideOfProduct = getCheapestProvideOfProduct;

// Return prefered provide of customer to a product
// If previously purchased, get most frequent
// If not, get cheapest.
exports.getPreferedProvide = function(customer, product_id, callback) {
	CustomerService.checkPurchasing(customer, product_id, function (purchased) {
		if (purchased) {
			Provide.find({product_id: product_id, deleted: false}).
			exec(function (err, provides) {
				if (err) {
					callback(null);
				} else {
					if (provides.length==1) {
						callback(provides[0])
					} else {

					}
				}
			});
		} else {
			getCheapestProvideOfProduct(product_id, function(err, provide) {
				if (err) {
					callback(null);
				} else {
					callback(provide);
				}
			});
		}
	})
}
var PurchaseLine = require('../../models/purchase_line'),
	Purchase = require('../../models/purchase'),
	async = require('async');

exports.getPurchaseLineByPurchaseId = function(purchase_id, callback) {
	PurchaseLine.find({purchase_id: purchase_id}, function (err, purchaselines) {
		if (err) {
			callback([]);
		} else {
			callback(purchaselines);
		}
	});
}

// Returns all historic purchase lines of customer
exports.getPurchaseLinesByCustomerProduct = function (customer_id, product_id, callback) {
	Purchase.find({customer_id: customer_id})
	.exec(function (err, purchases) {
		if (err) {
			callback(z)
		} else {
			var purchase_lines = [];
			async.each(purchases, function (purchase, _callback) {
				PurchaseLine.find({purchase_id: purchase._id, product_id: product_id})
				.exec(function (err, purchase_lines_obj) {
					if (err) {
						_callback(500);
					} else {
						if (purchase_lines_obj) {
							purchase_lines = purchase_lines.concat(purchase_lines_obj);
						}
						_callback();
					}
				});
			}, function(err) {
				if (err) {
					callback(null);
				} else {
					callback(purchase_lines);
				}
			});
		}
	});
}
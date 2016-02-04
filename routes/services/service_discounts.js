var Discount = require('../../models/discount'),
	IsOver = require('../../models/is_over'),
	jwt = require('jsonwebtoken');

// Returns if discount code is applied to a product
exports.canRedeemCode = function (cookie, jwtKey, code, product_id, callback) {
	Discount.findOne({code: code}).exec (function (err, discount) {
		if (err) {
			callback(null);
		} else {
			if (discount) {
				IsOver.count({discount_id: discount._id, product_id: product_id})
				.exec (function (err, number) {
					if (err) {
						callback(null);
					} else {
						if (number) {
							callback(discount);
						} else {
							callback(null);
						}
					}
				});
			} else {
				callback(null);
			}
		}
	});
}
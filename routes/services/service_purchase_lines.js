var PurchaseLine = require('../../models/purchase_line');

exports.getPurchaseLineByPurchaseId = function(purchase_id, callback) {
	PurchaseLine.find({purchase_id: purchase_id}, function (err, purchaselines) {
		if (err) {
			callback([]);
		} else {
			callback(purchaselines);
		}
	});
}
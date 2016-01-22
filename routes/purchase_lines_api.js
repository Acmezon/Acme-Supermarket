var PurchaseLines = require('../models/purchase_line');

exports.getPurchaseLinesByPurchaseId = function (req, res) {
	var _code = req.params.id;
	console.log('Function-purchasesLinesApi-getPurchaseLinesByPurchaseId  --  id: ' + _code);
	PurchaseLines.find({purchase_id: _code}, function (err, purchaselines) {
		if (err) {
			res.status(500).json({success: false, message: err});
		} else {
			res.status(200).json(purchaselines);
		}
	})
}
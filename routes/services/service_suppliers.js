var Supplier = require('../../models/supplier');

exports.getSupplierById = function(id, callback) {
	Supplier.findById(id, function (err, supplier) {
		if (err) {
			callback(null);
		} else {
			callback(supplier);
		}
	});
}
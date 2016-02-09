var	Reputation = require('../../models/reputation'),
	Provide = require('../../models/provide')
	SupplierService = require('./service_suppliers');

//Devuelve la reputacion media para un supplier
exports.averageReputation = function (supplier_id, callback) {
	Provide.find({ supplier_id: supplier_id}, function (err, provides) {
		if(err){
			callback(err, null);
		}
		
		var provide_ids = provides.map(function (provide) { return parseInt(provide.id); });
		
		Reputation.aggregate([
			{ 
				$match : {provide_id : { $in: provide_ids } }
			},
			{
				$group: {
					_id : null,
					avg : { $avg : "$value" }
				}
			}
		], function (err, results) {
			callback(err, results);
		});
	});
};

exports.saveReputationForCustomer = function (cookie, key, customer_id, provide_id, value, callback) {
	SupplierService.userHasPurchased(cookie, key, provide_id, function (response) {
		if(!response) {
			callback({ code: 401, message: "The customer has not purchased this provide" }, null);
			return;
		}
		Provide.findOne( { _id : provide_id, deleted: false }, function (err, provide) {
			if(err || !provide) {
				callback({ code: 503, message: "Error while working with the database" }, null);
				return;
			}
			Reputation.findOne({ customer_id : customer_id, provide_id : provide.id }, function (err, reputation) {
				if(err) {
					callback({ code: 503, message: "Error while working with the database" }, null);
					return;
				} else {
					if(reputation) {
						// Reputation found: Update
						Reputation.findByIdAndUpdate(reputation.id, { $set : { value : value } }, function (err, updated) {
							if (err) {
								callback({ code: 503, message: "Error while working with the database" }, null);
								return;
							} else {
								callback(null, updated);
							}
						});
					} else {
						// Rate not found: Create new one
						var new_reputation = new Reputation({
							value: value,
							provide_id : provide.id,
							customer_id : customer_id
						});

						new_reputation.save(function (err, saved) {
							if (err) {
								callback({ code: 503, message: "Error while working with the database" }, null);
								return;
							} else {
								callback(null, saved);
							}
						});
					}
				}
			});
		});
	});
};

exports.deleteAllByProvide = function (provide, callback) {
	Reputation.remove({ provide_id: provide._id }, function (err) {
		if (err) {
			callback(false);
		} else {
			callback(true);
		}
	});
}
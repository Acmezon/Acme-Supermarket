var	Reputation = require('../../models/reputation'),
	Provide = require('../../models/provide');

//Devuelve la reputacion media para un supplier
exports.averageReputation = function (supplier_id, callback) {
	Provide.find({ supplier_id: supplier_id}, function (err, provides) {
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
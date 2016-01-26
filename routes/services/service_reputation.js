var	Reputation = require('../../models/reputation');

//Devuelve la reputacion media para un supplier
exports.averageReputation = function (supplier_id, callback) {
	Reputation.aggregate([
		{ "$match" : { "supplier_id" : parseInt(supplier_id) }},
		{
			"$group":{
				"_id" : "$supplier_id",
				"avg" : { "$avg" : "$value"}
			}
		}
	], function (err, results) {
		callback(err, results);
	});
};
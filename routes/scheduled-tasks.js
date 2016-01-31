var schedule = require('node-schedule'),
	sync = require('synchronize'),
	PurchasingRule = require('../models/purchasing_rule'),
	PurchaseService = require('./services/service_purchase');

exports.scheduleAutomaticPurchases = function() {
											//Every day at 17:00
	var autoPurchase = schedule.scheduleJob({hour: 19, minute: 38}, function(){
		var start = new Date();
		start.setHours(0,0,0,0);

		var end = new Date();
		end.setHours(23,59,59,999);

		PurchasingRule.find({ nextRun : { $gte: start, $lt: end} }, function (err, results) {
			console.log(results);
		});
	});

	console.log("Automatic purchases task successfuly scheduled")
}
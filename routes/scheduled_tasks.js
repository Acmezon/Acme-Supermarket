var schedule = require('node-schedule'),
	sync = require('synchronize'),
	PurchasingRule = require('../models/purchasing_rule'),
	PurchaseService = require('./services/service_purchase'),
	Winston = require('winston');

exports.scheduleAutomaticPurchases = function() {
											//Every day at 17:00
	var autoPurchase = schedule.scheduleJob({hour: 08, minute: 00}, function(){
		var start = new Date();
		start.setHours(0,0,0,0);

		var end = new Date();
		end.setHours(23,59,59,999);

		PurchasingRule.find({ nextRun : { $gte: start, $lt: end} }, function (err, results) {
			if(err) {
				console.log(err);
			}

			sync.fiber(function () {
				for(var i = 0; i < results.length; i++) {
					var rule = results[i];

					var result = sync.await(PurchaseService.purchaseScheduled(rule.customer_id, rule.provide_id, rule.quantity, sync.defer()));

					console.log("Purchased: " + result);

					var nextRun = new Date(rule.nextRun);

					nextRun.setDate(nextRun.getDate() + rule.periodicity);

					sync.await(PurchasingRule.findByIdAndUpdate(rule.id, {$set : { nextRun: nextRun }}, sync.defer()));
				}				
			}, function (err, data){
				if(err) {
					console.log(err);
				}
			})
		});
	});

	console.log("Automatic purchases task successfuly scheduled")
}

exports.loggerTest = function(req, res) {
	Winston.add(Winston.transports.File, { filename: 'logs/scheduled-tasks.log' });
	Winston.level = 'info';
	Winston.info('Testing log');
}
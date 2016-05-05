var schedule = require('node-schedule'),
	sync = require('synchronize'),
	PurchasingRule = require('../models/purchasing_rule'),
	Purchase = require('../models/purchase'),
	PurchaseService = require('./services/service_purchase'),
	RecommenderService = require('./services/service_recommender_server'),
	RouteService = require('./services/service_routes'),
	log = require('../logger');

exports.scheduleAutomaticPurchases = function() {
											//Every day at 03:00AM
	var autoPurchase = schedule.scheduleJob({hour: 3, minute: 0}, function(){
		var end = new Date();
		end.setHours(23,59,59,999);

		PurchasingRule.find({ nextRun : { $lt: end } }, function (err, results) {
			if(err) {
				console.log(err);
			}

			sync.fiber(function () {
				for(var i = 0; i < results.length; i++) {
					console.log("Purchasing rule " + i + " of " + results.length);
					var rule = results[i];

					var result = sync.await(PurchaseService.purchaseScheduled(rule.customer_id, rule.provide_id, rule.quantity, sync.defer()));

					var nextRun = new Date(rule.nextRun);

					nextRun.setDate(nextRun.getDate() + rule.periodicity);

					sync.await(PurchasingRule.findByIdAndUpdate(rule.id, {$set : { nextRun: nextRun }}, sync.defer()));
				}				
			}, function (err, data){
				if(err) {
					log.info('Error executing automatic purchasing rule. Error %s', err);
				}
				console.log("Finished");
			})
		});
	});

	console.log("Automatic purchases task successfuly scheduled")
}

exports.scheduleSimilarityMatrix = function() {
	//Every day at 03:00AM
	var autoPurchase = schedule.scheduleJob({hour: 3, minute: 0}, function(){
		RecommenderService.computeSimilarity(function (err, data){
			if(err) {
				log.info('Error executing automatic similarity computation. Error %s', err);
			}
			console.log("Finished");
		});
	});

	console.log("Automatic similarity computation successfuly scheduled")
}

exports.scheduleAssociationRules = function() {
	//Every day at 03:00AM
	var autoPurchase = schedule.scheduleJob({hour: 3, minute: 0}, function(){
		RecommenderService.preprocessingRules(function (err, response){
			if(err) {
				log.info('Error executing automatic association rules preprocessing. Error %s', err);
			}
			console.log("Finished");
		});
	});

	console.log("Automatic association rules preprocessing successfuly scheduled")
}

exports.scheduleRoutes = function() {
	var autoRoute = schedule.scheduleJob({hour: 1, minute: 0}, function(){
		//Every day at 01:00AM
		RouteService.todayRoutePlanification(function (err, response) {
			if (err){
				log.info('Error executing automatic route planification. Error %s', err);
			}
		});
	});
	console.log("Automatic route planification successfuly scheduled")
}
var db_utils = require('./db_utils');
var Recommendation_rates = require('../models/recommendations_rates'),
	Recommendation_purchases = require('../models/recommendation_purchases'),
	Config_rates = require('../models/config_rates'),
	Config_purchases = require('../models/config_purchases'),
	recommendation_service = require('./services/service_recommender_system');

// Returns the recommendations of a customer identified by received id
exports.getRecommendations = function (req, res) {
	var user_id = req.params.userId;

	Recommendation_rates.find({ "customer_id" : user_id}).select({ 'product_id' : 1, '_id' : 0 }).exec(function (err, recommendation_rate) {
		if(err) res.sendStatus(500);

		if(!recommendation_rate.length) {
			Recommendation_purchases.find({ "customer_id" : user_id}).select({ 'product_id' : 1, '_id' : 0 }).exec(
				function (err, recommendation_purchase) {
					if(err) res.sendStatus(500);

					if(!recommendation_purchase.length) {
						res.sendStatus(204);
					} else {
						res.status(200).json(recommendation_purchase);
					}
			});
		} else {
			res.status(200).json(recommendation_rate);
		}
	});

};

exports.recommend = function(req, res) {
	var user_id = req.params.userId;
	recommendation_service.runRecommendation(user_id, 
		function (error, stdout, stderr) {
			if(error) {
				res.sendStatus(503);
			} else {
				res.sendStatus(200);
			}
		}
	);
}

exports.updateParameters = function(req, res) {
	var user_id = req.params.userId;

	recommendation_service.updateParameters(user_id, 
		function (error, stdout, stderr) {
			if(error) {
				res.sendStatus(503);
			} else {
				res.sendStatus(200);
			}
		}
	);
}

exports.notFound = function(req, res) {
	res.sendStatus(404);
}
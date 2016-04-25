var db_utils = require('./db_utils');
var Recommendation_rates = require('../models/recommendations_rates'),
	Recommendation_purchases = require('../models/recommendation_purchases'),
	Config_rates = require('../models/config_rates'),
	Config_purchases = require('../models/config_purchases'),
	Purchase = require('../models/purchase'),
	recommendation_service = require('./services/service_recommender_system');

// Returns the recommendations of a customer identified by received id
exports.getRecommendations = function (req, res) {
	var user_id = req.params.userId;

	Recommendation_rates.find({ "customer_id" : user_id}).select({ 'product_id' : 1, '_id' : 0 }).exec(function (err, recommendation_rate) {
		if(err) res.sendStatus(500);

		if(!recommendation_rate.length) {
			res.sendStatus(204);
		} else {
			res.status(200).json(recommendation_rate);
		}
	});

};

exports.recommendRates = function(req, res) {
	console.log("Api-recommendRates:" + req.params.userId);
	var user_id = req.params.userId;
	recommendation_service.runRatesRecommendation(user_id, 
		function (error, stdout, stderr) {
			if(error) {
				console.log("Finished with error: " + error);
				res.sendStatus(500);
			} else {
				console.log("Finished successfully");
				res.sendStatus(200);
			}
		}
	);
}

exports.recommendPurchases = function(req, res) {
	throw "Not supported";
	var user_id = req.params.userId;
	recommendation_service.runPurchasesRecommendation(user_id, 
		function (error, stdout, stderr) {
			if(error) {
				res.sendStatus(500);
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
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		}
	);
}

exports.storePurchase = function(req, res) {
	throw "Not supported";
	var customer_id = req.body.customer;
	var product_id = req.body.product;

	//Si no esta presente el producto o el cliente
	if(!customer_id || !product_id) {
		//Devolvemos un error de petición mal formada
		res.sendStatus(400);
		return;
	}

	Purchase.find({'customer_id' : customer_id, 'product_id' : product_id}, function (err, results) {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		if(results.length) {
			//Si ya hay un registro que indica que el cliente ha comprado ese producto, no se hace nada
			console.log("Already purchased");
			res.sendStatus(200);
			return;
		} else {
			//Si no existe el registro, se crea uno nuevo
			var purchase = new Purchase({
				'customer_id' : customer_id,
				'product_id' : product_id
			});

			//Y se guarda
			purchase.save( function (err) {
				if(err) {
					console.log("ERR: " + err);
					res.sendStatus(500);
					return;
				}

				res.sendStatus(200);
				return;
			});
		}

	});
}

exports.checkStatus = function(req, res) {
	res.sendStatus(200);
}

exports.notFound = function(req, res) {
	res.sendStatus(404);
}
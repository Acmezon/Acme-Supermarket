var db_utils = require('./db_utils');
var Recommendation = require('../models/recommendations')
	Config = require('..models/configs');
var recommendation_service = require('services/service_recommendation_system');

// Returns the recommendations of a customer identified by received id
exports.getRecommendations = function (req, res) {
	var user_id = req.params.id;


};

exports.recommend = function(req, res) {
	var user_id = req.params.id;
	recommendation_service.()
}

exports.updateParameters = function(req, res) {
	var user_id = req.params.id;
}
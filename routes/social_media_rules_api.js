var SocialMediaRule = require('../models/social_media_rule'),
	Product = require('../models/product'),
	ActorService = require('./services/service_actors'),
	async = require('async');

// Returns all media rules with product attached
exports.getAll = function (req, res) {
	console.log('Function-socialMediaRulesAPI-getAll');

	var cookie = req.cookies.session,
		jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				SocialMediaRule.find(function (err, socialmediarules) {
					if (err) {
						res.status(500).json({success: false});
					} else {
						var r = [];
						async.each(socialmediarules, function (socialmediarule, _callback) {

							if (socialmediarule.product_id) {
								Product.findById(socialmediarule.product_id, function (err, product) {
									if (!err) {
										if (product) {
											// No other way modify values
											var copy = JSON.parse(JSON.stringify(socialmediarule));
											// Add product
											copy.productName = product.name;
											r.push(copy)
											_callback();
										} else {
											_callback(500);
										}
									} else {
										_callback(500);
									}
								});
								
							} else {
								r.push(socialmediarule)
								_callback();
							}
							
						}, function(err) {
							if (err) {
								res.status(parseInt(err)).json({success: false});
							} else {
								res.status(200).json(r);
							}
						});
						
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Deletes a social media rule instance
exports.deleteSocialMediaRule = function (req, res) {
	var rule_id = parseInt(req.params.id) || null;
	if (!rule_id) {
		res.status(500).json({success: false});
	} else {
		console.log("Function-socialMediaRulesAPI-delete --id: " + rule_id)

		var cookie = req.cookies.session,
			jwtKey = req.app.get('superSecret');

		ActorService.getUserRole(cookie, jwtKey, function (role) {
			if (role=='admin' || role=='supplier' || role=='customer') {
				if (role=='admin') {
					console.log(rule_id)
					SocialMediaRule.remove({_id: rule_id}, function (err) {
						if (err) {
							res.status(500).json({success: false});
						} else {
							res.status(200).json({success: true});
						}
					});
				} else {
					res.status(403).json({success: false});
				}
			} else {
				res.status(401).json({success: false});
			}
		});
	}
}
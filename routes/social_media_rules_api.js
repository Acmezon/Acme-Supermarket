var SocialMediaRule = require('../models/social_media_rule'),
	Product = require('../models/product'),
	ProductRule = require('../models/product_rule'),
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
											copy.product_name = product.name;
											copy.product_image = product.image;
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
	var rule_id = parseInt(req.params.id) || -1;
	console.log("Function-socialMediaRulesAPI-delete --id: " + rule_id)

	var cookie = req.cookies.session,
		jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
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
};

// Creates a product monitoring rule_id
exports.createProductRule = function (req, res) {
	console.log("Function-socialMediaRulesAPI-createProductRule");
	var rule = req.body.rule;

	var cookie = req.cookies.session,
		jwtKey = req.app.get('superSecret');

	if (rule) {
		ActorService.getUserRole(cookie, jwtKey, function (role) {
			if (role=='admin' || role=='supplier' || role=='customer') {
				if (role=='admin') {

					var new_rule = new ProductRule({
						increaseRate : rule.increaseRate,
						product_id : rule.product_id
					});

					new_rule.save(function (err) {
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
	} else {
		res.status(500).json({success: false});
	}
}
var ActorService = require('./services/service_actors'),
	SocialMediaRule = require('../models/social_media_rule'),
	ProductNotifications = require('../models/product_notification'),
	BrandNotifications = require('../models/brand_notification'),
	Product = require('../models/product'),
	SocialMediaNotifications = require('../models/social_media_notification'),
	async = require('async');

exports.getNotificationsBySocialMediaRuleId = function (req, res) {
	var _code = req.params.id;
	console.log(_code)
	console.log('Function-socialMediaNotificationsApi-getNotificationsBySocialMediaRuleId  --  id: ' + _code);

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	if (_code) {
		// Check authenticated
		ActorService.getUserRole(cookie, jwtKey, function(role) {
			if (role=='admin' || role=='customer' || role=='supplier') {
				if (role=='admin') {
					SocialMediaRule.findById(_code, function (err, rule) {
						if (err) {
							res.status(500).json({success: false, message: err});
						} else {
							if (rule) {
								if (rule._type=='ProductRule') {
									ProductNotifications.find({product_rule_id: rule._id, _type: 'ProductNotification'}, function (err, notifications) {
										if (err) {
											res.status(500).json({success: false, message: err});
										} else {
											if (notifications.length) {
												var r = [];
												async.each(notifications, function (notification, _callback) {
													Product.findById(notification.product_id, function (err, product) {
														if (err) {
															_callback(500);
														} else {
															if (product) {
																// No other way modify values
																var copy = JSON.parse(JSON.stringify(notification));
																// Add product
																copy.product_name = product.name;
																copy.product_image = product.image;
																copy.product_id = product._id;
																r.push(copy)
																_callback();
															} else {
																_callback(500);
															}
														}
													});

												}, function(err) {
													if (err) {
														res.status(parseInt(err)).json({success: false});
													} else {
														res.status(200).json(r);
													}
												});
											} else {
												res.status(200).json([]);
											}
										}
									});
								} else {
									if (rule._type=='BrandRule') {
										BrandNotifications.find({brand_rule_id: rule._id, _type: 'BrandNotification'}, function (err, notifications) {
											if (err) {
												res.status(500).json({success: false, message: err});
											} else {
												res.status(200).json(notifications);
											}
										});
									} else {
										res.status(500).json({success: false});
									}
								}
							} else {
								res.status(500).json({success: false});
							}
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
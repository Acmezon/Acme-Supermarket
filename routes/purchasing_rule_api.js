var PurchasingRule = require('../models/purchasing_rule'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	PurchasingRuleService = require('./services/service_purchasing_rules');

exports.createPurchasingRule = function(req, res) {
	// Check principal is customer or administrator
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer') { 
			CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (customer) {
				if(!customer) {
					res.status(403).json({success: false, message: "Doesnt have permission"});
				} else {
					PurchasingRuleService.customerHasRule(cookie, jwtKey, req.body.provide_id, function (result) {
						if(!result) {
							var rule_data = req.body.rule;

							if (rule_data != undefined) {
								var purchasing_rule = new PurchasingRule({
									startDate: rule_data.startDate,
									periodicity: rule_data.periodicity,
									quantity: rule_data.quantity,
									provide_id: req.body.provide_id,
									customer_id: customer.id
								});

								purchasing_rule.save(function (err) {
									if(err) {
										console.log(err);
										res.sendStatus(500);
									} else {
										res.sendStatus(200);
									}
								});
							} else {
								console.log("No rule");
								res.sendStatus(500);
							}
						} else {
							res.sendStatus(503);
						}
					});
				}
			});
		} else {
			res.status(401).json({success: false});
		}
	});
};

exports.removePurchasingRule = function(req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	// Check principal is customer or administrator
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role == 'admin' || role == 'customer') {
			if(role == 'customer') {
				CustomerService.getPrincipalCustomer(cookie, jwtKey, function (customer) {
					if(!customer) {
						res.status(403).json({success: false, message: "Doesnt have permission"});
					} else {
						var purchasing_rule_id = req.body.id;
						
						if (purchasing_rule_id == undefined) {
							console.log("No rule");
							res.sendStatus(500);
							return;
						}

						PurchasingRule.find({ customer_id: customer.id, _id: purchasing_rule_id}).limit(1).exec(function (err, results) {
							if(results.length == 0) {
								res.status(403).json({success: false, message: "Doesnt have permission"});
								return;
							} else {
								PurchasingRule.remove({_id: purchasing_rule_id}, function (err) {
									if(err) {
										res.sendStatus(500);
										return;
									} else {
										res.sendStatus(200);
										return;
									}
								});
							}
						});
					}
				});
			} else {
				var purchasing_rule_id = req.body.id;
				if (purchasing_rule_id != undefined) {
					PurchasingRule.remove({_id: purchasing_rule_id}, function (err) {
						if(err) {
							res.sendStatus(500);
							return;
						} else {
							res.sendStatus(200);
							return;
						}
					});
				} else {
					console.log("No rule");
					res.sendStatus(500);
					return;
				}
			}
		} else {
			res.status(401).json({
				success: false,
				message: "Doesnt have permission"
			});
		}
	});
};
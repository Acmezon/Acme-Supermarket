var PurchasingRule = require('../models/purchasing_rule'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	ProductService = require('./services/service_products'),
	PurchasingRuleService = require('./services/service_purchasing_rules'),
	sync = require('synchronize');

exports.createPurchasingRule = function(req, res) {
	// Check principal is customer or administrator
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer') { 
			var rule_data = req.body.rule;

			if (rule_data != undefined) {
				var purchasing_rule = {
					startDate: rule_data.startDate,
					periodicity: rule_data.periodicity,
					quantity: rule_data.quantity,
					provide_id: req.body.provide_id
				};

				if(role == 'admin') {
					PurchasingRuleService.customerIdHasRule(rule_data.customer_id, req.body.provide_id, function (result) {
						if(!result) {
							PurchasingRuleService.saveRule(purchasing_rule, rule_data.customer_id, function (err, saved){
								if(err) {
									res.sendStatus(503);
								} else {
									res.sendStatus(200);
								}
							});
						} else {
							res.status(200).json({success: false});
						}
					});
				} else {
					CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (customer) {
						if(!customer) {
							res.status(403).json({success: false, message: "Doesnt have permission"});							
						} else {
							PurchasingRuleService.customerHasRule(cookie, jwtKey, req.body.provide_id, function (result) {
								if(!result) {
									PurchasingRuleService.saveRule(purchasing_rule, customer.id, function (err, saved){
										if(err) {
											res.sendStatus(503);
										} else {
											res.sendStatus(200);
										}
									});
								} else {
									res.sendStatus(503);
								} 
							});
						}
					});
				}
			} else {
				console.log("No rule");
				res.sendStatus(500);
			}
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

exports.getPurchasingRulesFiltered = function (req, res) {
	console.log('Function-pruchasingRulesApi-purchasingRulesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1,
		customerFilter = parseInt(req.body.customerFilter) || null;


	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='admin') {
				var query;

				if (customerFilter) {
					query = PurchasingRule.find({ customer_id: customerFilter});
				} else {
					query = PurchasingRule.find();
				}

				query
				.sort(ord_tuple)
				.skip(pageSize * currentPage)
				.limit(pageSize)
				.exec(function (err, rules) {
					if (err) {
						// Internal server error
						res.status(500).json({success: false, message: err});
					} else {
						var completed_rules = [];

						sync.fiber(function () {
							for(var i = 0; i < rules.length; i++) {
								var rule_obj = rules[i].toObject();

								var provide_id = rule_obj.provide_id;

								var product = sync.await(ProductService.getProductByProvideId(provide_id, sync.defer()));

								if(product) {
									rule_obj['product_name'] = product.name;
									rule_obj['product_id'] = product.id;
								} else {
									rule_obj['product_name'] = undefined;
									rule_obj['product_id'] = undefined;
								}

								completed_rules.push(rule_obj);
							}

							return completed_rules;
						}, function (err, data) {
							if(err) {
								console.log(err);
								res.sendStatus(500);
							} else {
								res.status(200).json(data);
							}
						});
					}
				});
			} else {
				// Not admin should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
};

exports.countPurchasingRulesFiltered = function (req, res) {
	console.log('Function-pruchasingRulesApi-countPurchasingRulesFiltered');

	var currentPage = parseInt(req.body.currentPage) || 0,
		pageSize = parseInt(req.body.pageSize) || 20,
		sort = req.body.sort,
		order = parseInt(req.body.order) || 1,
		customerFilter = parseInt(req.body.customerFilter) || null;

	var ord_tuple = {};
	ord_tuple[sort] = order;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') { 
			if (role=='admin') {
				var query;

				if (customerFilter) {
					query = PurchasingRule.count({ customer_id: customerFilter});
				} else {
					query = PurchasingRule.count();
				}

				query
				.exec(function (err, number) {
					if (err) {
						// Internal server error
						res.status(500).json({success: false, message: err});
					} else {
						res.status(200).json(number);
					}
				});
			} else {
				// Not admin should not be requesting this
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
};
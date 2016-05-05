var async = require('async'),
	Route = require('../models/route.js'),
	Customer = require('../models/customer.js');

exports.getTodayRoute = function(req, res) {
	var today = new Date()
	console.log("Api-getTodayRoute __today: " + today);
	//Route.findOne({day: today.getDate(), month: today.getMonth(), year: today.getFullYear()})
	Route.findOne()
	.exec(function (err, routeObject) {
		if (err) {
			res.status(500).json({success:false})
		} else {
			if (!routeObject) {
				res.status(500).json({success:false})
			} else {
				if (routeObject.customers.length==0) {
					res.status(200).json({'date': today, 'route': []})
				} else {
					var nodes = []
					var i = 0
					async.eachSeries(routeObject.customers, function (customer_id, callback) {

						Customer.findById(customer_id).exec(function (err, customer) {
							if (err) {
								res.status(500).json({success:false})
							} else {
								var node = {'customer_id' : customer_id,
									'time' : routeObject.times[i],
									'customer' : customer}
								nodes.push(node)
							}

							i++
							callback();
						});

					}, function (err) {
						if(err){
							res.sendStatus(500);
						} else {
							res.status(200).json({'date': today, 'route' : nodes})
						}
					});

					
				}

			}
			

			
		}
	})
}
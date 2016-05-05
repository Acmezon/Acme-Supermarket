var Route = require('../models/route.js'),
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
			var nodes = []
			var i = 0
			routeObject.customers.forEach(function (customer_id) {
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
					if (nodes.length == routeObject.customers.length) {
						// Last iteration
						res.status(200).json({'date': today,
									'route' : nodes})
					}
				});
			});

			
		}
	})
}
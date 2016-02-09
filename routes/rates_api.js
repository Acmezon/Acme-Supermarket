var db_utils = require('./db_utils');
var Rate = require('../models/rate'),
	RateService = require('./services/service_rates'),
	Customer = require('../models/customer'),
	ProductService = require('./services/service_products'),
	CustomerService = require('./services/service_customers'),
	ActorService = require('./services/service_actors'),
	RecommenderService = require('./services/service_recommender_server');

// Returns the avg rating of a product by id
exports.getAverageRatingByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/getAverageRatingByProductId/'+_code)

	Rate.find({product_id: _code},function (err,rates){
		if(err > 0){
			console.log('---ERROR finding Rates with  product_id: '+_code+' message: '+ err);
			res.status(500).json({success: false, message: err});
		}else{
			var total = 0;
			for(var i = 0; i < rates.length; i++) {
			    total += rates[i].value;
			}
			var rating = total / rates.length;
			res.status(200).json(rating);
		}
	});
}

// Update/Create a rating by an admin for a customer
exports.manageRating = function (req, res) {
	var customer_id = parseInt(req.body.customer_id) || -1,
		product_id = parseInt(req.body.product_id) || -1,
		value = parseInt(req.body.value) || -1;

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	var customer = {_id: customer_id, _type: 'Customer'};

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				
				RateService.rateProductForCustomer(customer, product_id, value, function (err, saved) {
					if(err) {
						res.status(err.code).json({success: false})
					} else {
						res.sendStatus(200);
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
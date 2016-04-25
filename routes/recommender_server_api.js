var request = require('request'),
	Products = require('../models/product');

exports.checkStatus = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3030/api/checkStatus',
		'timeout' : 1000
	}, function (err, response, body) {
		if(err){
			res.status(200).json({ 'online' : false });
		} else {
			res.status(200).json({ 'online' : true });
		}

	})
}

exports.getAssociationRules = function (req, res) {
	var shoppingcart = req.body.shoppingcart
	request.post({
			url: 'http://localhost:3030/api/recommend/associationrules/getconsequents',
			timeout : 1000,
			form: {
				shoppingcart: shoppingcart
			}
		}, function(err,httpResponse,body){
			if(err){
				res.sendStatus(500)
			} else {
				if (body.length>0) {
					products = []
					errors = false
					for (var id in body){
						Products.findById(id).exec(function (err, product) {
							if (err) {
								errors = true
							} else {
								products.push(product)
							}
						})
					}
					if (errors) {
						res.sendStatus(500)
					} else {
						res.status(200).json(products);
					}
					
				} else {
					res.status.json([])
				}
			}
	});
}
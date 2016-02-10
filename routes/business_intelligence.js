var request = require('request'),
	Supplier = require('../models/supplier'),
	ActorService = require('./services/service_actors');

// Returns .CSV format of dashboard input
exports.getSalesOverTime = function (req, res) {
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='supplier' || role=='admin') {
			if (role=='admin') {
				var supplier_id = req.params.id;
				if(supplier_id == undefined || supplier_id == '') {
					res.sendStatus(500);
					return;
				}

				var product_id = req.query.productid;
				var url = 'http://localhost:3031/api/bi/getSalesOverTime/'+supplier_id;

				if(product_id != undefined && product_id != '') {
					url += '?productid=' + product_id;
				}

				request({
					'method' : 'GET',
					'url' : url
				}, function (err, response, body) {
					if(err){
						res.sendStatus(500);
					} else {
						res.status(200).send(body);
					}
				});
			} else {
				// Doesn't have permissions
				res.status(403).json({success: false});
			}
		} else {
			// Not authenticated
			res.status(401).json({success: false});
		}
	});
}

// Returns link to a .PDF report
exports.getReport = function (req, res) {
	var year = parseInt(req.body.year) || null,
		email = req.body.supplier_email;

	console.log("Funtion-BI_API-getReport");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role){
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				var today  = new Date();
				if (year>=2010 && year <= today.getFullYear() && email) {
					Supplier.findOne({email: email, _type: 'Supplier'}, function (err, supplier) {
						if (err) {
							res.status(500).send({success: false});
						} else {
							if (supplier) {
								var params = { 'supplier_email': supplier.email, 'year' : year };

								request.post({
									url: 'http://localhost:3031/api/bi/getReport',
									form: params
								}, function(err, httpResponse, body){
									if(err){
										res.status(500).send({success: false});
									} else {
										res.status(200).json({success: true, url: "reports/sales/" + supplier.email + "-" + year + ".pdf"})
									}
								});
							} else {
								// Supplier not found: Show toast
								res.status(200).json({success: false})
							}
						}
					});
				} else {
					res.status(500).send({success: false});
				}
			} else {
				res.status(403).send({success: false});
			}
		} else {
			res.status(401).send({success: false});
		}
	});
}

exports.checkStatus = function (req, res) {
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3031/api/checkStatus',
		'timeout' : 1000
	}, function (err, response, body) {
		if(err){
			res.status(200).json({ 'online' : false });
		} else {
			res.status(200).json({ 'online' : true });
		}

	})
}
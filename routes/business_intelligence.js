var request = require('request'),
	requestify = require('requestify'),
	Supplier = require('../models/supplier'),
	ActorService = require('./services/service_actors');

// Returns .CSV format of dashboard input
exports.getSalesOverTime = function (req, res) {
	var supplier_id = req.params.id;
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3031/api/bi/getSalesOverTime/'+supplier_id
	}, function (err, response, body) {
		if(err){
			res.sendStatus(500);
		} else {
			res.status(200).send(body);
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
				if (year>=2010 && year <= today.getFullYear()) {
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
										res.status(200).json({success: true, url: "reports/sales/" + supplier.email + year + ".pdf"})
									}
								});
							} else {
								// Supplier not found: Show toast
								res.status(200).json({success: true})
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
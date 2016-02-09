var request = require('request'),
	ActorService = require('./services/service_actors');

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
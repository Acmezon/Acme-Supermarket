var db_utils = require('./db_utils'),
	Supplier = require('../models/supplier'),
	ActorService = require('./services/service_actors');

//Devuelve un nombre de un supplier
exports.getSupplierName = function (req, res) {
	var _code = req.params.id;
	console.log('GET /api/supplierName/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' | role=='supplier') {

			Supplier.findById( _code,function(err,supplier){
				if(err){
					console.log('---ERROR finding Supplier: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(supplier);
					res.status(200).json(supplier.name);
				}
			});

		} else {
			res.status(401).json({success: false, message: "Doesnt have permission"});
		}
	});

	
};
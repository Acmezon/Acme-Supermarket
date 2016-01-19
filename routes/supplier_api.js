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
				//TODO: Comprobar errores correctamente
				var errors= [];//db_utils.handleErrors(err);
				if(errors.length > 0){
					console.log('---ERROR finding Supplier: '+_code+' message: '+errors);
					res.status(500).json({success: false, message: errors});
				}else{
					//console.log(supplier);
					res.status(200).json(supplier.name);
				}
			});

		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});

	
};

//Devuelve si el usuario es un supplier
exports.isSupplier = function(req, res) {
	var _id = req.params.id;
	console.log('Function-supplierApi-isSupplier -- _id:'+_id);

	var cookie = req.cookies.session;
	var jwt = req.app.get('superSecret');
	// Check is supplier or admin
	ActorService.getUserRole(cookie, jwt, function (role) {
		if (role=='admin' || role=='supplier') {

			Supplier.findbyId( _id, function(err,user){
				if(err){
					res.status(500).json({success: false, message: err});
				}
				else{
					if (user._type.toLowerCase() == 'supplier') {
						res.status(200).json(true);
					} else {
						res.status(200).json(false);
					}			
				}
			});

		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});

	
};
var db_utils = require('./db_utils');
var Supplier = require('../models/supplier');

//Devuelve un nombre de un supplier de la coleccion
exports.getSupplierName = function (req, res) {
	var _code = req.params.id;
	console.log('GET /api/supplierName/'+_code)

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
};

//Devuelve si el usuario es un supplier
exports.isSupplier = function(req, res) {
	var _id = req.params.id;
	console.log('Function-supplierApi-isSupplier -- _id:'+_id);

	Admin.findbyId( _id, function(err,user){
		if(err){
			res.status(500).json({success: false, message: err});
		}
		else{
			if (user._type == 'Supplier') {
				res.status(200).json(true);
			} else {
				res.status(200).json(false);
			}			
		}
	});
};
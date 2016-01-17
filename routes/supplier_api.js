var db_utils = require('./db_utils');
var Supplier = require('../models/supplier');
var multer  = require('multer');
var fs = require('fs');

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
//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_utils = require('./db_utils');
var Product = require('../models/product');

//Devuelve una lista con todos los productos de la coleccion
exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');

	//Find sin condiciones
	Product.find(function(err,products){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors.length > 0){
			console.log('---ERROR finding AllProduct - message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			res.status(200).json(products);
		}
	});
};


//Devuelve un producto de la coleccion
exports.getProduct = function (req, res) {
	console.log('Function-productsApi-getProduct');
	var _code = req.params.code;

	Product.findOne({'code':_code},function(err,product){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors){
			console.log('---ERROR finding Product: '+_code+' message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			//console.log(products);
			res.status(200).json(product);
		}
	});
};


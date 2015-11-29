//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_connection = require('./db_connection');
var Product = require('../models/product');

//Devuelve una lista con todos los productos de la coleccion
exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');

	//Find sin condiciones
	Product.find(function(err,products){
		var errors=db_connection.handleErrors(err);
		if(errors){
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
		var errors=db_connection.handleErrors(err);
		if(errors){
			console.log('---ERROR finding Product: '+_code+' message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			//console.log(products);
			res.status(200).json(product);
		}
	});
};


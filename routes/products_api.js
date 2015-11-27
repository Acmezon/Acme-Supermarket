//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_connection = require('./db_connection');
var Product = require('../models/product');

//Devuelve una lista con todos los productos de la coleccion
exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');

	//Find sin condiciones
	Product.find(function(err,products){
		if(err){
			console.error(err);
		}else{
			//console.log(products);
			res.json(products);
		}
	});
};







//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_connection = require('./db_connection');
var Product = require('../models/product')

//Esto lo borras y usas la variable Product
//var productModel = mongoose.model('product',productSchema)


exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');
	//productModel.find();
	Product.find(function(err,products){
		if(err){
			console.error(err);
		}else{
			//console.log(products);
			res.json(products);
		}
	});
};







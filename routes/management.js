var db_utils = require('./db_utils');
var Customer = require('../models/customer');
var Product = require('../models/product');
var Admin = require('../models/admin');
var Credit_card = require('../models/credit_card');
var credit_card_api = require('./credit_card_api');
var crypto = require('crypto');//Necesario para encriptacion por MD5
var mongoose = require('mongoose');//Para la generacion de ids


// Restore Mongo DB to development state
exports.resetDataset = function (req, res) {
	console.log('Function-management-resetDataset');

	Product.remove({}, function(err) {
		if(err){
			console.log('--ERROR products collection NOT removed');
			console.error(err);
		}else{
			for (var i = 0; i < 100; i++ ){
				var product = new Product({
					"name":"Product" + i,
					"description":"Fantastic product" + i,
					"code": new mongoose.Types.ObjectId, //code is generated automaticaly
					"price": i,
					"rating": i % 5,
					"image":"../public/img/template_boostrap/pic1.jpg"
				});

				product.save(function (err) {
					if(err) {
						console.log('---ERROR saving Product ' + i +': '+product.name+' message: '+errors);
					} 
					else{
						console.log('---new Product ' + i + ': '+product.name);
					}
				});
			}
		}
	});
	res.json("Done, check the console");
};


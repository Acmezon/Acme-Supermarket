var db_connection = require('./db_connection');
var Customer = require('../models/customer');
var Actor = require('../models/actor');
var crypto = require('crypto');//Necesario para encriptacion por MD5

var extend = require('mongoose-schema-extend');//Necesario para la herencia

exports.getCustomer = function (req, res) {
	var _email = req.body.email;
	console.log('Function-productsApi-getCustumer');
	//console.log('-- _email:'+_email);


	Customer.findOne({email:_email}, function(err,customer){
		if(err) {
			console.err(err);
		} else {
			if(customer != null){
				//console.log('---Customer found');
				res.status(200).json(customer);
			}
			else{
				console.log('---Customer not found, incorrect email');
				res.sendStatus(404);
			}
		}
	});
};

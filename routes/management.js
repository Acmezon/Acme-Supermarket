var db_utils = require('./db_utils');
var Customer = require('../models/customer');
var Product = require('../models/product');
var Admin = require('../models/admin');
var crypto = require('crypto');//Necesario para encriptacion por MD5
var mongoose = require('mongoose');//Para la generacion de ids


//Restaura la base de datos de productos al estado del dataset
exports.resetDataset = function (req, res) {
	console.log('Function-management-resetDataset');


	Product.remove({}, function(err) {
		if(err){
			console.log('--ERROR products collection NOT removed');
			console.error(err);
		}else{
			console.log('--products collection removed');
			console.log('--Populating products');
			var product1 = new Product({
				"name":"sunglases",
				"description":"Fantastic sunglases for the suny days",
				"code": new mongoose.Types.ObjectId, //code is generated automaticaly
				"price":43.3,
				"rating":4.5,
				"image":"../public/img/template_boostrap/pic8.jpg"
			});

			var product2 = new Product({
				"name":"Cheap Sunglases",
				"description":"Not much fantastic sunglases for the suny days",
				"code": new mongoose.Types.ObjectId,
				"price":1.3,
				"rating":2.5,
				"image":"../public/img/template_boostrap/s1.jpg"
			});


			product1.save(function (err) {
				var errors = null;//TODO: db_utils.handleErrors(err);

				if(errors) {
					console.log('---ERROR saving Product: '+product1.name+' message: '+errors);
				} 
				else{
					console.log('---Product: '+product1.name);
				}

			});

			product2.save(function (err) {
				var errors = null;//db_utils.handleErrors(err);

				if(errors) {
					console.log('---ERROR saving Product: '+product2.name+' message: '+errors);
				} 
				else{
					console.log('---Product: '+product2.name);
				}

			});


		}
	});


	Customer.remove({}, function(err) {
		if(err){
			console.log('--ERROR customers collection NOT removed');
			console.error(err);
		}else{
			console.log('--customers collection removed');
			console.log('--Populating customers');
			var customer1Password = crypto.createHash('md5').update('esmuysegura').digest("hex");
			var customer1 = new Customer({ 
				"name": "Pablo", 
				"surname": "Carrasco",
				"email": "reder.pablo@gmail.com",
				"password": customer1Password, 
				"coordinates": "[37.358716, -5.987814]",
				"credict_card": "1234567890123456",
				"address": "Avda. Reina Mercedes, s/n",
				"country": "Spain",
				"city": "Sevilla",
				"phone": "999999999",
			});

			customer1.save(function (err) {
				var errors = null; //TODO: db_utils.handleErrors(err);
		  		if(errors){
					console.log('---ERROR saving Customer: '+customer1.email+' message: '+errors);
				}
				else{
					console.log('---Customer: '+customer1.email);
				}
			});
		}
	});

	Admin.remove({}, function(err) {
		if(err){
			console.log('--ERROR admin collection NOT removed');
			console.error(err);
		}else{
			console.log('--admin collection removed');
			console.log('--Populating admin');

			var adminPassword = crypto.createHash('md5').update('adminuser').digest("hex");
			var newAdmin = new Admin({ 
				"name": "adminuser", 
				"surname": "i have the power",
				"email": "adminuser@email.com",
				"password": adminPassword, 

			});
			
			newAdmin.save(function (err) {
				var errors = null; //TODO: db_utils.handleErrors(err);
		  		if(errors){
					console.log('---ERROR saving Admin: '+newAdmin.email+' message: '+errors);
				}
				else{
					console.log('---Admin: '+newAdmin.email);
				}
			});
		}
	});

	res.json("Done, check the console");

	
};


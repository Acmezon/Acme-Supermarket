var db_utils = require('./db_utils');
var Customer = require('../models/customer');
var Product = require('../models/product');
var Admin = require('../models/admin');
var Credit_card = require('../models/credit_card');
var credit_card_api = require('./credit_card_api');
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
				var errors = db_utils.handleInsertErrors(err);

				if(errors.lenght>0) {
					console.log('---ERROR saving Product: '+product1.name+' message: '+errors);
				} 
				else{
					console.log('---new Product: '+product1.name);
				}

			});

			product2.save(function (err) {
				var errors = db_utils.handleInsertErrors(err);

				if(errors.lenght>0) {
					console.log('---ERROR saving Product: '+product2.name+' message: '+errors);
				} 
				else{
					console.log('---new Product: '+product2.name);
				}

			});


		}
	});

	Credit_card.remove({}, function(err) {
		if(err){
			console.log('--ERROR credit_cards collection NOT removed');
			console.error(err);
		}else{
			console.log('--credit_cards collection removed');
		}
	});


	Customer.remove({}, function(err) {
		if(err){
			console.log('--ERROR customers collection NOT removed');
			console.error(err);
		}else{
			console.log('--customers collection removed');
			console.log('--Populating customers and credit_cards');
			var customer1Password = crypto.createHash('md5').update('password').digest("hex");


			var credit_card1 = new Credit_card({
				"holderName": "Pablo Carrasco",
				"brandName": "VISA",
				"number": "4556-8129-6993-2217",
				"expirationMonth": 7,
				"expirationYear": 2030,
				"cwCode": 123
			});

			//Synchronous
			credit_card_api.newCredit_card(credit_card1, 
				function (errors) {
					if(errors.length > 0) {
						console.log('---ERROR saving Credict_card: '+credit_card1.holderName+' message: '+errors);
					} else {
						console.log('---new Credict_card: '+credit_card1.number);
					}
				}
			);

			//console.log('credit_card1._id: '+credit_card1.id);
			

			var customer1 = new Customer({ 
				"name": "John", 
				"surname": "Doe",
				"email": "johndoe@mail.com",
				"password": customer1Password, 
				"coordinates": "[37.358716, -5.987814]",
				"credit_card": credit_card1.id,
				"address": "Avda. Reina Mercedes, s/n",
				"country": "Spain",
				"city": "Sevilla",
				"phone": "999999999",
			});

			customer1.save(function (err) {
				var errors = db_utils.handleInsertErrors(err);
		  		if(errors.lenght>0){
					console.log('---ERROR saving Customer: '+customer1.email+' message: '+errors);
				}
				else{
					console.log('---new Customer: '+customer1.email);
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

			var adminPassword = crypto.createHash('md5').update('password').digest("hex");
			var newAdmin = new Admin({ 
				"name": "admin", 
				"surname": "i have the power",
				"email": "admin@mail.com",
				"password": adminPassword, 

			});
			
			newAdmin.save(function (err) {
				var errors = db_utils.handleInsertErrors(err);
		  		if(errors.lenght>0){
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


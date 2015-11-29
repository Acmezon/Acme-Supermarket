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



/*
//OLD -> use authentication.signup
exports.newCustomer = function (req, res) {
	console.log('Function-productsApi-newCustomer');


	var isInUse = emailInUse(req.body.email);

	if(isInUse){
		console.log('Email already in use');
		res.status(500).json({success: false, message: 'Email already in use'})
	}
	else{
		//Guardar la entrada de datos en variables
	    var _name = req.body.name;
	    var _surname = req.body.surname;
	    var _email = req.body.email;
	    var _password = req.body.password;
	    var _coordinates = req.body.coordinates;
	    var _credict_card = req.body.credict_card;
	    var _address = req.body.address;
	    var _country = req.body.country;
	    var _city = req.body.city;
	    var _phone = req.body.phone;




	    //TODO Chequear que los campos son correctos
		//TODO Check if the email already exist
		
	    var md5Password = crypto.createHash('md5').update(_password).digest("hex");

	    var newCustomer = new Customer({
		    name: _name,
		    surname: _surname,
		    email: _email,
		    password: md5Password,
		    coordinates: _coordinates,
		    credict_card: _credict_card,
		    address: _address,
		    country: _country,
		    city: _city,
		    phone: _phone
	    });


	    newCustomer.save(function (err) {
			var errors=db_connection.handleErrors(err);
			
			if(errors) {
				res.status(500).json({success: false, message: errors});
			} else {
				res.status(200).json({success: true});
			}
		});
	}

};

*/

var db_utils = require('./db_utils'),
	Customer = require('../models/customer'),
	Actor = require('../models/actor'),
	crypto = require('crypto'),//Necesario para encriptacion por MD5	
	db_utils = require('./db_utils');


exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	console.log('Function-productsApi-getCustumer -- _email:'+_email);


	Customer.findOne({email:_email}, function(err,custumer){
		if(err){
			//console.log('--Costumer not found');
			console.error(err);
			throw err;
		}
		else{
			res.json(custumer);
			res.sendStatus(200);
		}
	});
};

exports.newCustomer = function (customer, callback) {
	console.log('Function-productsApi-newCustomer');

	//Guardar la entrada de datos en variables
	var _name = customer.name;
	var _surname = customer.surname;
	var _email = customer.email;
	var _password = customer.password;
	var _coordinates = customer.coordinates;
	var _credict_card = customer.credict_card;
	var _address = customer.address;
	var _country = customer.country;
	var _city = customer.city;
	var _phone = customer.phone;

	//TODO Chequear que los campos son correctos
	
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
		callback(db_utils.handleInsertErrors(err));
	});

	return;
};

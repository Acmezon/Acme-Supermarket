var db_connection = require('./db_connection');
var Customer = require('../models/customer');
var crypto = require('crypto');//Necesario para encriptacion por MD5
var extend = require('mongoose-schema-extend');//Necesario para la herencia


exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	var _password = req.params.password;
	console.log('Function-productsApi-getCustumer');
	//console.log('-- _email:'+_email+'   _password:'+_password);


	Customer.findOne({email:_email}, function(err,customer){
		var errors=db_connection.handleErrors(err);

		if(errors) {
			res.status(500).json({success: false, message: errors});
		} else {
			if(customer != null){
				//console.log('---Customer found');
				var md5Password = crypto.createHash('md5').update(_password).digest("hex");
				if(customer.password.valueOf() == md5Password.valueOf()){
					res.status(200).json(customer);
				}else{
					console.log('---Customer found, wrong password ');
					res.status(404).json({success: true, customer: true, password: false});
				}
			}
			else{
				console.log('---Customer not found, incorrect email');
				res.status(404).json({success: true, customer: false, password: false});
			}
		}

	});
	
};

exports.newCustomer = function (req, res) {
	console.log('Function-productsApi-newCustomer');

	//Guardar la entrada de datos en variables
    var _name = req.params.name;
    var _surname = req.params.surname;
    var _email = req.params.email;
    var _password = req.params.password;
    var _coordinates = req.params.coordinates;
    var _credict_car = req.params.credict_card;
    var _address = req.params.address;
    var _country = req.params.country;
    var _city = req.params.city;
    var _phone = req.params.phone;




    //TODO Chequear que los campos son correctos

	
    var md5Password = crypto.createHash('md5').update(_password).digest("hex");

    var newCustomer = new Customer({
	    name: _name,
	    surname: _surname,
	    email: _email,
	    password: md5Password,
	    coordinates: _coordinates,
	    credict_card: _credict_car,
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

};


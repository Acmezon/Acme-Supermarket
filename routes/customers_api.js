var db_connection = require('./db_connection');
var Customer = require('../models/customer');
var crypto = require('crypto');//Necesario para encriptacion por MD5

exports.getCustomer = function (req, res) {
	//var connection = db_connection.connect;
	var _email = req.params.email;
	var _password = req.params.password;
	console.log('Function-productsApi-getCustumer -- _email:'+_email+'   _password:'+_password);

	Customer.findOne({email:_email},function(err,customer){
		if(err){
			//console.log('--Error in Customer.findOne{email:_email} query');
			console.error(err);
		}
		else{
			if(customer != null){
				console.log('---Customer found');
				var md5Password = crypto.createHash('md5').update(_password).digest("hex");
				//console.log('---md5Password: '+md5Password);
				//console.log('---customer: '+customer);
				if(customer.password.valueOf() == md5Password.valueOf()){
					//console.log('---Customer found'+customer);
					res.json(customer);
				}else{
					console.log('---Customer found, wrong password ');
					res.json({});
				}
			}
			else{
				console.log('---Customer not found, incorrect email');
				res.json({});
			}

		}

	});

	//connection.disconnect;
	
};

exports.newCustomer = function (req, res) {
	//var connection = db_connection.connect;
	console.log('Function-productsApi-newCustomer');

	//Guardar la entrada de datos en variables
    var _name = req.params.name;
    var _surname = req.params.surname;
    var _email = req.params.email;
    var _password = req.params.password;
    var _address = req.params.address;
    var _coordinates = req.params.coordinates;
    var _credict_car = req.params.credict_card;

    //TODO Chequear que los campos son correctos

	
    var md5Password = crypto.createHash('md5').update(_password).digest("hex");

    var newCustomer = new Customer({
	    name: _name,
	    surname: _surname,
	    email: _email,
	    password: md5Password,
	    address: _address,
	    coordinates: _coordinates,
	    credict_card: _credict_car
    });


    newCustomer.save(function (err) {
  		if(err){
			console.error(err);
		}
		else{
			//console.log('--New custumer created '+newCustomer);
			res.json(newCustomer);
		}
	});

	//connection.disconnect;

};




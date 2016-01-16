var db_utils = require('./db_utils'),
	Customer = require('../models/customer'),
	credit_card_api = require('./credit_card_api')
	CreditCard = require('../models/credit_card'),
	Actor = require('../models/actor'),
	crypto = require('crypto'),//Necesario para encriptacion por MD5	
	db_utils = require('./db_utils');


exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	console.log('Function-productsApi-getCustumer -- _email:'+_email);


	Customer.findOne({email:_email}, function(err,customer){
		if(err){
			//console.log('--Costumer not found');
			console.error(err);
			throw err;
		}
		else{
			res.json(customer);
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
		credit_card: "",
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

exports.updateCC = function(req, res){
	var cc = new CreditCard({
		holderName : req.body.cc.holderName,
		number : req.body.cc.number,
		expirationMonth: req.body.cc.expirationMonth,
		expirationYear: req.body.cc.expirationYear,
		cvcCode: req.body.cc.cvcCode,
	});

	if(!req.body.id_cc){
		credit_card_api.newCreditCard(cc, 
			function (errors) {
				if(errors.length > 0) {
					res.status(500).json({success: false, message: errors});
				} else {
					Customer.findByIdAndUpdate(req.body.customer_id, { $set : { credit_card: cc._id } }, function (err, customer) {
						if(err) {
							CreditCard.find(cc._id).remove().exec();
							res.sendStatus(503);
						}
					});
					res.status(200).json({success: true});
				}
			}
		);
	} else {
		credit_card_api.updateCreditCard(req.body.id_cc, cc, 
			function (errors) {
				if(errors.length > 0) {
					res.status(500).json({success: false, message: errors});
				} else {
					res.status(200).json({success: true});
				}
			}
		);
	}
};

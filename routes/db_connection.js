/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');//Necesario para la herencia
var config = require('../config')

exports.connect = function () {
	mongoose.connect(config.database);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function (callback) {
	  console.log('Mongoose connection to Acme-Supermarket database successfull');
	});

	return db;
};


exports.disconnect = function () {
	mongoose.disconnect();
}



//////MANAGEMENT////////////////////////////////////////
//Esto también lo quitas de aquí y lo mueves a otro lado

//Restaura la base de datos de productos al estado del dataset
exports.resetDataset = function (req, res) {
	console.log('Function-productsApi-resetDataset');

	productModel.remove({}, function(err) {
		if(err){
			console.log('--ERROR products collection NOT removed');
			console.error(err);
		}else{
			console.log('--products collection removed');
			console.log('--Populating products');
			var product1 = new productModel({"name":"sunglases","description":"Fantastic sunglases for the suny days","code":"12b34a1","price":43.3,"rating":4.5,"image":"no-image.png"});
			var product2 = new productModel({"name":"Cheap Sunglases","description":"Fantastic sunglases for the suny days","code":"12buua1","price":1.3,"rating":4.5,"image":"no-image.png"});

			product1.save(function (err) {
		  		if(err)
					console.error(err);
			});

			product2.save(function (err) {
		  		if(err)
					console.error(err);
			});


		}
	});

	customerModel.remove({}, function(err) {
		if(err){
			console.log('--ERROR customers collection NOT removed');
			console.error(err);
		}else{
			console.log('--customers collection removed');
			console.log('--Populating customers');
			var customer1 = new customerModel({ "name": "userName", "surname": "userSurname", "email": "reder.pablo@gmail.com","password": "12345", "address": "String", "coordinates": "[37.358716, -5.987814]", "credict_card": "String"});
			
			customer1.save(function (err) {
		  		if(err)
					console.error(err);
			});
		}
	});


	res.json("Done, check the console");

	
};


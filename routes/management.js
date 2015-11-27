var db_connection = require('./db_connection');
var Customer = require('../models/customer');
var Product = require('../models/product');



//Restaura la base de datos de productos al estado del dataset
exports.resetDataset = function (req, res) {
	var connection = db_connection.connect;
	console.log('Function-productsApi-resetDataset');






	Product.remove({}, function(err) {
		if(err){
			console.log('--ERROR products collection NOT removed');
			console.error(err);
		}else{
			console.log('--products collection removed');
			console.log('--Populating products');
			var product1 = new Product({"name":"sunglases","description":"Fantastic sunglases for the suny days","code":"12b34a1","price":43.3,"rating":4.5,"image":"no-image.png"});
			var product2 = new Product({"name":"Cheap Sunglases","description":"Fantastic sunglases for the suny days","code":"12buua1","price":1.3,"rating":4.5,"image":"no-image.png"});

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


	Customer.remove({}, function(err) {
		if(err){
			console.log('--ERROR customers collection NOT removed');
			console.error(err);
		}else{
			console.log('--customers collection removed');
			console.log('--Populating customers');
			var customer1 = new Customer({ "name": "userName", "surname": "userSurname", "email": "reder.pablo@gmail.com","password": "12345", "address": "String", "coordinates": "[37.358716, -5.987814]", "credict_card": "String"});
			
			customer1.save(function (err) {
		  		if(err)
					console.error(err);
			});
		}
	});


	connection.disconnect;
	res.json("Done, check the console");

	
};



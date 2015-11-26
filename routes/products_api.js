/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');//Necesario para la herencia
mongoose.connect('mongodb://localhost/Acme-Supermarket');

//Creación de la conexion con mongodb
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function (callback) {
  console.log('Mongoose connection to Acme-Supermarket database successfull');
});


//var crypto = require('crypto');//Necesario para encriptacion por MD5


//////PRODUCTS////////////////////////////////////////

//Declaracion de los schemas, es la estructura que tienen 
//los documentos en la base de datos
var productSchema = mongoose.Schema({
    name: String,
    description: String,
    code: String,
    price: {type:Number,min:0},
    rating: {type:Number,min:0,max:5},
    image: String
});


//Creacion del modelo en base a los schemas
//El modelo se crea sobre la coleccion de products,
// pero en el nombre hay que ponerlo sin la s final
var productModel = mongoose.model('product',productSchema)


exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');
	//productModel.find();
	productModel.find(function(err,products){
		if(err){
			console.error(err);
		}else{
			//console.log(products);
			res.json(products);
		}
	});
};





//////CUSTOMERS////////////////////////////////////////

//Declaracion de los schemas, es la estructura que tienen 
//los documentos en la base de datos
var actorSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    address: String,
    coordinates: String,
    credict_card: String
});

var customerSchema = actorSchema.extend({
	//TODO
});
var adminSchema = actorSchema.extend({
	//TODO
});

//Creacion del modelo en base a los schemas
//El modelo se crea sobre la coleccion de products,
// pero en el nombre hay que ponerlo sin la s final
var customerModel = mongoose.model('customer',customerSchema)

exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	var _pasword = req.params.password;
	console.log('Function-productsApi-getCustumer -- _email:'+_email+' _pasword:'+_pasword);


	customerModel.findOne({email:_email},function(err,custumer){
		if(err){
			//console.log('--Costumer not found');
			console.error(err);
			res.sendStatus(404);
		}
		else{
			//if(custumer.)
			//console.log('--Costumer found'+custumer);
			res.json(custumer);
			res.sendStatus(200);
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
    var _address = req.params.address;
    var _coordinates = req.params.coordinates;
    var _credict_car = req.params.credict_card;

    //TODO Chequear que los campos son correctos

	
    //var md5Password = crypto.createHash('md5').update(_password).digest("hex");

    var newCustomer = new customerModel({
	    name: _name,
	    surname: _surname,
	    email: _email,
	    password: _password,
	    address: _address,
	    coordinates: _coordinates,
	    credict_card: _credict_car
    });


    newCustomer.save(function (err) {
  		if(err){
			console.error(err);
			res.sendStatus(404);
		}
		else{
			//console.log('--New custumer created');
			res.sendStatus(200);
		}
	});

};





//////MANAGEMENT////////////////////////////////////////

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



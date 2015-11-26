/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose');
//var extend = require('mongoose-schema-extend');//Necesario para la herencia
mongoose.connect('mongodb://localhost/Acme-Supermarket');

//Creación de la conexion con mongodb
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function (callback) {
  console.log('Mongoose connection to Acme-Supermarket database successfull');
});





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



/*

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
var customerModel = mongoose.model('customer',productSchema)

exports.getConstumer = function (req, res) {
	var _email = req.params.email;
	var _pasword = req.params.password;
	console.log('Function-productsApi-getConstumer');
	customerModel.findOne({email:_email},function(err,costumer){
		if(err){
			//console.log('--Costumer not found');
			console.error(err);
			res.sendStatus(404);
		}
		else{
			//if(costumer.)
			//console.log('--Costumer found'+costumer);
			res.json(costumer);
			res.sendStatus(200);
		}
	});
};

exports.newConstumer = function (req, res) {
	console.log('Function-productsApi-newConstumer');

	//Guardar la entrada de datos en variables
    var _name = req.params.name;
    var _surname = req.params.surname;
    var _email = req.params.email;
    var _password = req.params.password;
    var _address = req.params.address;
    var _coordinates = req.params.coordinates;
    var _credict_car = req.params.credict_card;

    //TODO Chequear que los campos son correctos

	var data = "do shash'owania";
	var crypto = require('crypto');
	crypto.createHash('md5').update(data).digest("hex");
    var md5Password = 

    var newConstumer = new customerModel({
	    name: _name,
	    surname: _surname,
	    email: _email,
	    password: _password,
	    address: _address,
	    coordinates: _coordinates,
	    credict_card: _credict_car
    });

	customerModel.find(function(err,products){
		if(err)
			console.error(err);
		else
			//console.log('--New costumer created');
			res.sendStatus(200);
	});
};





//////MANAGEMENT////////////////////////////////////////

//Restaura la base de datos de productos al estado del dataset
exports.resetDataset = function (req, res) {
	console.log('Function-productsApi-resetDataset');

	productModel.remove({}, function(err) {
		if(err){
			console.error(err);
		}else{
			console.log('--products collection removed');
			console.log('--Populating Database');


		}

	});
};

*/

/*
//MongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/Acme-Supermarket';

exports.getAllProducts = function (req, res) {
	//Conexion a mongoDB
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

		//Find de todos los productos
		var cursor = db.collection('products').find( );

		//Por cada documento encontrado en el Find se mete en documentos
		var documentos = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				documentos.push(doc);
			} else {
				db.close();
				//Transformamos la cola de documentos a JSON
				res.json(documentos);
			}
		});
	});
};*/
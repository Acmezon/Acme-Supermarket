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


function getConnection () {
	console.log('Function-db_connection-getConnection');
	return db;
};

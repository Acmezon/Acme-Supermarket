/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose');

exports.connect = function () {
	mongoose.connect(config.database);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function (callback) {
	  console.log('Mongoose connection to Acme-Supermarket-Recommendations database successfull');
	});

	return db;
};
/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.database);


	
exports.connect = function () {
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function (callback) {
	  console.log('Mongoose connection to Acme-Supermarket database successfull');
	});
	return db;
};



exports.disconnect = function () {
	mongoose.disconnect();
};




exports.handleErrors = function(err){
	var errors = null;
	if(err){
		errors = [];
		console.log(err.errors)
		keys = Object.keys(err.errors);
		for(key in keys) {
			key = keys[key];
			errors.push({
				key: key,
				value: err.errors[key].name
			});
		}
	}
	return errors;
};
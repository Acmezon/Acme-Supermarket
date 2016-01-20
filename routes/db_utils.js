/*
 * Api for mongodb
 */

//MongoDB
//Declaracion de la base de datos
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),//Necesario para la herencia
	config = require('../config'),
	autoIncrement = require('mongoose-auto-increment');;

exports.connect = function () {
	mongoose.connect(config.database);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function (callback) {
	  console.log('Mongoose connection to Acme-Supermarket database successfull');
	});

	autoIncrement.initialize(db);

	return db;
};

exports.disconnect = function () {
	mongoose.disconnect();
};

exports.handleInsertErrors = function(err){
	var errors = [];

	if(err != null && err.code == 11000){
		if(err.message.indexOf('duplicate') > -1 && err.message.indexOf('email') > -1) {
			errors.push({
				key: "email",
				vale : "ValidationError"
			});
		}
	} else if (err != null) {
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
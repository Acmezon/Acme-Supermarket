var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var actorSchema = require('./actor');

var customerSchema = actorSchema.extend({
	//TODO
	});


module.exports = mongoose.model('Customer', customerSchema);
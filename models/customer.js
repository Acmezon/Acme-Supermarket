var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Actor = require('./actor');

var customerSchema = Actor.schema.extend({
	coordinates: String,
	credit_card: String,
	address: String,
	country: String,
	city: String,
	phone: String
});

module.exports = mongoose.model('Customer', customerSchema);
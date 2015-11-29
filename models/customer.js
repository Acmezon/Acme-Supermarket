var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor');

var customerSchema = Actor.schema.extend({
	coordinates: String, //TODO validator [number,number]
	credit_card: {type: String, validate: validators.isCreditCard()},
	address: {type: String, require: true},
	country: {type: String, require: true},
	city: {type: String, require: true},
	phone: {type: String, require: true, validate: validators.isLength(9, 15)}
});

module.exports = mongoose.model('Customer', customerSchema);

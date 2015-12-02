var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor');

var customerSchema = Actor.schema.extend({
	coordinates: String, //TODO validator [number,number]
	credit_card: mongoose.Schema.Types.ObjectId,
	address: {type: String, required: true},
	country: {type: String, required: true},
	city: {type: String, required: true},
	phone: {type: String, required: true, validate: validators.isLength(9, 15)}
});

module.exports = mongoose.model('Customer', customerSchema);

var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Actor = require('./actor');

var customerSchema = Actor.schema.extend({
	//TODO
});

module.exports = mongoose.model('Customer', customerSchema);
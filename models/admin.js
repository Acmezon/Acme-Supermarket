var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var actorSchema = require('./actor');

var adminSchema = actorSchema.extend({
	//TODO
	});


module.exports = mongoose.model('Admin', customerSchema);
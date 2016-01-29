var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Actor = require('./actor');

var adminSchema = Actor.schema.extend({
	
});

module.exports = mongoose.model('Admin', adminSchema);
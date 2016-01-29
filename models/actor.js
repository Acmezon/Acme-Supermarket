var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
    autoIncrement = require('mongoose-auto-increment');

var actorSchema = mongoose.Schema({
	name: {type: String, required: true},
	surname: {type: String, required: true},
	email: {type: String, unique: true, validate: validators.isEmail()},
	password: {type: String, required: true}
}, {collection: 'actors', discriminatorKey: '_type'});

actorSchema.plugin(autoIncrement.plugin, 'Actor');

exports.schema = actorSchema;

module.exports = mongoose.model('Actor', actorSchema);
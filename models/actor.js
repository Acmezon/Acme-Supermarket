var mongoose = require('mongoose'),
	validators = require('mongoose-validators');

var actorSchema = mongoose.Schema({
	name: {type: String, required: true},
	surname: {type: String, required: true},
	email: {type: String, validate: validators.isEmail()},
	password: {type: String, validate: validators.isLength(8, 32)}
});

exports.schema = actorSchema;

exports.model = mongoose.model('Actor', actorSchema);
var mongoose = require('mongoose'),
	validators = require('mongoose-validators');

var actorSchema = mongoose.Schema({
	name: {type: String, required: true},
	surname: {type: String, required: true},
	email: {type: String, unique: true, validate: validators.isEmail()},
	password: {type: String, required: true}
});

exports.schema = actorSchema;

//exports.model = mongoose.model('Actor', actorSchema);
var mongoose = require('mongoose');

var actorSchema = mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	address: String,
	coordinates: String,
	credict_card: String
});

exports.schema = actorSchema;

exports.model = mongoose.model('Actor', actorSchema);
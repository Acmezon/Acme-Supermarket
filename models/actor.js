var mongoose = require('mongoose');

module.exports = mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	address: String,
	coordinates: String,
	credict_card: String
});
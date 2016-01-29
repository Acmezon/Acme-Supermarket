var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var categorySchema = mongoose.Schema({
	name: String
}, {collection: 'categories'});

categorySchema.plugin(autoIncrement.plugin, 'Category');

module.exports = mongoose.model('Category', categorySchema);
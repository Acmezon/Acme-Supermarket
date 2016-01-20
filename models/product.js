var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');



var productSchema = mongoose.Schema({
	name: String,
	description: {type: String, required: true},
	code: {type: String, required: true, unique:true},
	image: String
});

productSchema.plugin(autoIncrement.plugin, 'Product');

module.exports = mongoose.model('Product', productSchema);
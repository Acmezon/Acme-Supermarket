var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');



var productSchema = mongoose.Schema({
	name: {type: String, required: true, minlength: 1, maxlength: 100},
	description: {type: String, required: true, maxlength: 1000},
	code: {type: String, required: true, unique:true},
	image: String,
	minPrice: {type: Number, required:false, min:0},
	maxPrice: {type: Number, required:false, min:0},
	avgRating: {type: Number, required:false, min:0, max:5}
});

productSchema.plugin(autoIncrement.plugin, 'Product');

module.exports = mongoose.model('Product', productSchema);
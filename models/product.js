var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var productSchema = mongoose.Schema({
	name: String,
	description: {type: String, required: true},
	code: {type: String, required: true, unique:true},
	price: {type:Number,min:0, required: true},
	rating: {type:Number,min:0,max:5, required: true},
	image: String
});


module.exports = mongoose.model('Product', productSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var productSchema = mongoose.Schema({
	name: String,
	description: {type: String, required: true},
	code: {type: String, required: true, unique:true}
	image: String
});


module.exports = mongoose.model('Product', productSchema);
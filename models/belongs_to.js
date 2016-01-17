var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Category = require('./category');

var productSchema = mongoose.Schema({
	product_id : {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
	category_id : {type: mongoose.Schema.Types.ObjectId, ref:'Category'}
});


module.exports = mongoose.model('Product', productSchema);
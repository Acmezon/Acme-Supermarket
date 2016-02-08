var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product_dim = mongoose.Schema({
	product_id : {type: Number},
	code : {type: String},
	name : {type: String}
}, {collection: 'product_dim'});

module.exports = mongoose.model('product_dim', product_dim);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var purchase = mongoose.Schema({
	customer_id : {type: Number},
	product_id : {type: Number},
}, {collection: 'purchases'});

module.exports = mongoose.model('purchase', purchase);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendations_purchase = mongoose.Schema({
	customer_id : {type: Number},
	product_id : {type: Number},
	rating: {type: Number}
}, {collection: 'recommendations_purchase'});

module.exports = mongoose.model('recommendations_purchase', recommendations_purchase);
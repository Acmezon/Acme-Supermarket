var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendations_rates = mongoose.Schema({
	customer_id : {type: Number},
	product_id : {type: Number},
	rating: {type: Number}
}, {collection: 'recommendations_rates'});

module.exports = mongoose.model('recommendations_rates', recommendations_rates);
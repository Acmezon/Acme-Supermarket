var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendations = mongoose.Schema({
	customer_id : {type: Number},
	product_id : {type: Number},
	rating: {type: Number}
}, {collection: 'recommendations'});

module.exports = mongoose.model('recommendations', recommendations);
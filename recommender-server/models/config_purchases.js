var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config_purchases = mongoose.Schema({
	customer_id : {type: Number},
	rank : {type: Number},
	numIter: {type: Number},
	lambda : {type: Number}
}, {collection: 'config_purchases'});

module.exports = mongoose.model('config_purchases', config_purchases);
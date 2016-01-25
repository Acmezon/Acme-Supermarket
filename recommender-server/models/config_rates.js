var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config_rates = mongoose.Schema({
	customer_id : {type: Number},
	rank : {type: Number},
	numIter: {type: Number},
	lambda : {type: Number}
}, {collection: 'config_rates'});

module.exports = mongoose.model('config_rates', config_rates);
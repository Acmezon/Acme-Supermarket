var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configs = mongoose.Schema({
	customer_id : {type: Number},
	rank : {type: Number},
	numIter: {type: Number},
	lambda : {type: Number}
}, {collection: 'config'});

module.exports = mongoose.model('configs', configs);
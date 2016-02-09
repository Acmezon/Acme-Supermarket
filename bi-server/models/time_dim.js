var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var time_dim = mongoose.Schema({
	time_id : {type: String},
	date : {type: Date},
	day : {type: String},
	month : {type: String},
	year : {type: String}
}, {collection: 'time_dim'});

module.exports = mongoose.model('time_dim', time_dim);
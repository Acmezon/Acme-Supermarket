var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proportions = mongoose.Schema({
	from_time : {type: Date},
	to_time : {type: Date},
	positive: {type: Number},
	negative : {type: Number},
	neutral : {type: Number}
}, {collection: 'proportions'});

module.exports = mongoose.model('proportions', proportions);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routeSchema = mongoose.Schema({
	day: {type: Number, required: true},
	month: {type: Number, required: true},
	year: {type: Number, required: true},
	customers: [{type: Number}],
	times: [{type: Date}]
});

module.exports = mongoose.model('Route', routeSchema);
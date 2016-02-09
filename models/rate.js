var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var rateSchema = mongoose.Schema({
	value: {type:Number,min:0,max:5, required: true},
	product_id: {type: Number, ref:'Product', required: true},
	customer_id: {type: Number, ref:'Customer', required: true}
});

rateSchema.plugin(autoIncrement.plugin, 'Rate');

module.exports = mongoose.model('Rate', rateSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Discount = require('./discount'),
	autoIncrement = require('mongoose-auto-increment');

var is_over = mongoose.Schema({
	product_id : {type: Number, ref:'Product', required: true},
	discount_id : {type: Number, ref:'Discount', required: true}
}, {collection: 'is_over'});

is_over.plugin(autoIncrement.plugin, 'is_over');

module.exports = mongoose.model('is_over', is_over);
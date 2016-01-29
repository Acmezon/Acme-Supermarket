var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Category = require('./category'),
	autoIncrement = require('mongoose-auto-increment');

var belongs_to = mongoose.Schema({
	product_id : {type: Number, ref:'Product'},
	category_id : {type: Number, ref:'Category'}
}, {collection: 'belongs_to'});

belongs_to.plugin(autoIncrement.plugin, 'belongs_to');

module.exports = mongoose.model('belongs_to', belongs_to);
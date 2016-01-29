var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Supplier = require('./supplier'),
	autoIncrement = require('mongoose-auto-increment');

var provideSchema = mongoose.Schema({
	price: {type: Number, required:true, min:0},
	deleted: {type: Boolean, default: false},
	product_id : {type: Number, ref:'Product'},
	supplier_id : {type: Number, ref:'Supplier'}
}, {collection: 'provide'});

provideSchema.plugin(autoIncrement.plugin, 'Provide');

module.exports = mongoose.model('Provide', provideSchema);
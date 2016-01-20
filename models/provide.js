var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Supplier = require('./supplier'),
	autoIncrement = require('mongoose-auto-increment');

var provideSchema = mongoose.Schema({
	price: {type: Number, required:true, min:0},
	product_id : {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
	supplier_id : {type: mongoose.Schema.Types.ObjectId, ref:'Supplier'}
}, {collection: 'provide'});

provideSchema.plugin(autoIncrement.plugin, 'Provide');

module.exports = mongoose.model('Provide', provideSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Supplier = require('./supplier');



var provideSchema = mongoose.Schema({
	price: {type: Number, required:true, min:0},
	product_id : {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
	supplier_id : {type: mongoose.Schema.Types.ObjectId, ref:'Supplier'}
}, {collection: 'provide'});


module.exports = mongoose.model('Provide', provideSchema);
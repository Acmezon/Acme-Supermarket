var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Purchase = require('./purchase'),
	Provide = require('./provide'),
	Product = require('./product')
	autoIncrement = require('mongoose-auto-increment');

var purchaseLineSchema = mongoose.Schema({
	quantity: {type: Number, required:true, min:1, max:999, required:true},
	price: {type: Number, required:true, min:0},
	discounted: {type: Boolean, default: false},
	purchase_id: {type: Number, ref:'Purchase', required:true},
	provide_id: {type: Number, ref:'Provide', required:true},
	product_id: {type: Number, ref: 'Product', required:true}
}, {collection: 'purchase_lines'});

purchaseLineSchema.plugin(autoIncrement.plugin, 'PurchaseLine');

module.exports = mongoose.model('PurchaseLine', purchaseLineSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Purchase = require('./purchase'),
	Provide = require('./provide'),
	autoIncrement = require('mongoose-auto-increment');

var purchaseLineSchema = mongoose.Schema({
	quantity: {type: Number, required:true, min:1, max:999},
	purchase_id: {type: Number, ref:'Purchase'},
	provide_id: {type: Number, ref:'Provide'}
}, {collection: 'purchase_lines'});

purchaseLineSchema.plugin(autoIncrement.plugin, 'PurchaseLine');

module.exports = mongoose.model('PurchaseLine', purchaseLineSchema);
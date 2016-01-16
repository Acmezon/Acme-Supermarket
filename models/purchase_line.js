var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Purchase = require('./purchase'),
	Provide = require('./provide');



var purchaseLineSchema = mongoose.Schema({
	quantity: {type: Number, required:true, min:1, max:999},
	purchase_id: {type: mongoose.Schema.Types.ObjectId, ref:'Purchase'},
	provide_id: {type: mongoose.Schema.Types.ObjectId, ref:'Provide'}
});


module.exports = mongoose.model('PurchaseLine', purchaseLineSchema);
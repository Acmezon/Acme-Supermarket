var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Supplier = require('./supplier'),
	Customer = require('./customer'),
	Purchase = require('./purchase');



var reputationSchema = mongoose.Schema({
	reputation: {type:Number,min:0,max:5, required: true},
	supplier_id: {type: mongoose.Schema.Types.ObjectId, ref:'Supplier'},
	customer_id: {type: mongoose.Schema.Types.ObjectId, ref:'Customer'},
	purchase_id: {type: mongoose.Schema.Types.ObjectId, ref:'Purchase'}
});


module.exports = mongoose.model('Reputation', reputationSchema);
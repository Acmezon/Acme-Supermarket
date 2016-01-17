var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Supplier = require('./supplier'),
	Customer = require('./customer');



var reputationSchema = mongoose.Schema({
	value: {type:Number,min:0,max:5, required: true},
	supplier_id: {type: mongoose.Schema.Types.ObjectId, ref:'Supplier'},
	customer_id: {type: mongoose.Schema.Types.ObjectId, ref:'Customer'}
});


module.exports = mongoose.model('Reputation', reputationSchema);
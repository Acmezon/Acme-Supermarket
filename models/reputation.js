var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Supplier = require('./supplier'),
	Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var reputationSchema = mongoose.Schema({
	value: {type:Number,min:0,max:5, required: true},
	supplier_id: {type: Number, ref:'Supplier'},
	customer_id: {type: Number, ref:'Customer'}
});

reputationSchema.plugin(autoIncrement.plugin, 'Reputation');

module.exports = mongoose.model('Reputation', reputationSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Provide = require('./provide'),
	Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var reputationSchema = mongoose.Schema({
	value: {type:Number,min:0,max:5, required: true},
	provide_id: {type: Number, ref:'Provide', required: true},
	customer_id: {type: Number, ref:'Customer', required: true}
});

reputationSchema.plugin(autoIncrement.plugin, 'Reputation');

module.exports = mongoose.model('Reputation', reputationSchema);
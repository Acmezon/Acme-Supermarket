var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Provide = require('./product'),
	Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var purchasingRuleSchema = mongoose.Schema({
	startDate: {type: Date, default: Date.now, required: true},
	periodicity: {type: Number, required: true},
	customer_id: {type: Number, ref:'Customer', required: true},
	provide_id : {type: Number, ref: 'Provide', required: true}
}, {collection: 'purchasing_rules'});

purchasingRuleSchema.plugin(autoIncrement.plugin, 'PurchasingRule');

module.exports = mongoose.model('PurchasingRule', purchasingRuleSchema);
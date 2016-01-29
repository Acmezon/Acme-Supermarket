var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Provide = require('./product'),
	Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var purchasingRuleSchema = mongoose.Schema({
	startDate: {type: Date, default: Date.now},
	periodicity: {type: Number, required: true},
	quantity: {type: Number, required: true, min: 0, default: 1},
	nextRun : {type: Date},
	customer_id: {type: Number, ref:'Customer', required: true},
	provide_id : {type: Number, ref: 'Provide', required: true}
}, {collection: 'purchasing_rules'});

purchasingRuleSchema.plugin(autoIncrement.plugin, 'PurchasingRule');

module.exports = mongoose.model('PurchasingRule', purchasingRuleSchema);

purchasingRuleSchema.pre('save', function (next) {
	var nextRun = new Date(this.startDate.getTime());
	var periodicity = this.periodicity;

	nextRun.setDate(nextRun.getDate() + parseInt(periodicity));
	
	this.nextRun = nextRun;

	next();
});
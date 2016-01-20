var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment');

var purchaseSchema = mongoose.Schema({
	deliveryDate: {type: Date, required:true},
	paymentDate: {type: Date, required:true},
	customer_id: {type: Number, ref:'Customer'}
});

purchaseSchema.plugin(autoIncrement.plugin, 'Purchase');

module.exports = mongoose.model('Purchase', purchaseSchema);
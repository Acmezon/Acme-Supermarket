var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Customer = require('./customer'),
	autoIncrement = require('mongoose-auto-increment'),
	PurchaseLine = require('./purchase_line');

var purchaseSchema = mongoose.Schema({
	deliveryDate: {type: Date, required:true},
	paymentDate: {type: Date, required:true, default: Date.now},
	customer_id: {type: Number, ref:'Customer', required: true}
});

purchaseSchema.plugin(autoIncrement.plugin, 'Purchase');

module.exports = mongoose.model('Purchase', purchaseSchema);

purchaseSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Lineas de compra

	PurchaseLine.remove( { purchase_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
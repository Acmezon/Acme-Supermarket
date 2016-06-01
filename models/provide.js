var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Supplier = require('./supplier'),
	autoIncrement = require('mongoose-auto-increment'),
	Reputation = require('./reputation'),
	PurchasingRule = require('./purchasing_rule'),
	RaspberryCartLine = require('./raspberry_cart_line');

var provideSchema = mongoose.Schema({
	price: {type: Number, required:true, min:0},
	deleted: {type: Boolean, default: false},
	product_id : {type: Number, ref:'Product', required: true},
	supplier_id : {type: Number, ref:'Supplier', required: true}
}, {collection: 'provide'});

provideSchema.plugin(autoIncrement.plugin, 'Provide');

module.exports = mongoose.model('Provide', provideSchema);

provideSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las valoraciones recibidas
	//	Las reglas de compra que implican esta provide

	Reputation.remove( { provide_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			PurchasingRule.remove( { provide_id : this.id } ).exec(function (err) {
				if(err) {
					done(err);
				} else {
					RaspberryCartLine.remove( {provide_id: this.id} ).exec(function (err) {
						if (err) {
							done(err);
						} else {
							next();
						}
					})
				}
			});
		}
	});
});
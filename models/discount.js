var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IsOver = require('./is_over');

var discountSchema = mongoose.Schema({
	code: {type: String, required:true},
	discount: {type: Number, required: true, min:0}
}, {collection: 'discounts'});

discountSchema.plugin(autoIncrement.plugin, 'Discount');

module.exports = mongoose.model('Discount', discountSchema);

discountSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las aplicaciones de este descuento sobre productos

	IsOver.remove( { discount_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
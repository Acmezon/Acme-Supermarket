var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IsOver = require('./is_over'),
	CouponCode = require('coupon-code');

var discountSchema = mongoose.Schema({
	code: { type: String, required:true, unique: true, 
			validate: {
				validator: function(v) {
					return CouponCode.validate(v, { parts: 4 }) != '';
				}}
			},
	value: {type: Number, required: true, min:0, max:100}
},{collection: 'discounts'});

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
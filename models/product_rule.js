var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var SocialMediaRule = require('./social_media_rule'),
	Product = require('./product'),
	ProductNotification = require('./product_notification');

var productRuleSchema = SocialMediaRule.schema.extend({
	product_id : {type: Number, ref:'Product', required: true}
});

module.exports = mongoose.model('ProductRule', productRuleSchema);


productRuleSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las notificaciones de esta regla

	ProductNotification.remove( { product_rule_id: this.id, _type: 'ProductNotification' } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
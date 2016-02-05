var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var SocialMediaRule = require('./social_media_rule'),
	BrandNotification = require('./brand_notification');

var brandRuleSchema = SocialMediaRule.schema.extend({
});

module.exports = mongoose.model('BrandRule', brandRuleSchema);

brandRuleSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las notificaciones de esta regla

	BrandNotification.remove( { brand_rule_id: this.id, _type: 'BrandNotification' } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
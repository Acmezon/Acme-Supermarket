var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product')
	autoIncrement = require('mongoose-auto-increment'),
	SocialMediaNotification = require('./social_media_notification');

var socialMediaRuleSchema = mongoose.Schema({
	increaseRate: {type: Number, required: true, min: 0},
	product_id : {type: Number, ref:'Product', required: true}
}, {collection: 'social_media_rules'});

socialMediaRuleSchema.plugin(autoIncrement.plugin, 'SocialMediaRule');

module.exports = mongoose.model('SocialMediaRule', socialMediaRuleSchema);

socialMediaRuleSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las notificaciones de esta regla

	SocialMediaNotification.remove( { social_media_rule_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
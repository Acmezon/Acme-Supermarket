var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var	BrandRule = require('./brand_rule'),
	SocialMediaNotification = require('./social_media_notification');

var brandNotificationSchema = SocialMediaNotification.schema.extend({
	brand_rule_id :  {type: Number, ref:'BrandRule', required: true}
});

module.exports = mongoose.model('BrandNotification', brandNotificationSchema);
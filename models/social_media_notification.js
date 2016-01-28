var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product')
	SocialMediaRule = require('./social_media_rule')
	autoIncrement = require('mongoose-auto-increment');

var socialMediaNotificationSchema = mongoose.Schema({
	percentageExceeded: {type: Number, required: true, min: 0, required: true},
	moment: {type: Date, default: Date.now, required, true},
	social_media_rule_id :  {type: Number, ref:'SocialMediaRule', required: true},
	product_id : {type: Number, ref:'Product', required: true}
}, {collection: 'social_media_notifications'});

socialMediaNotificationSchema.plugin(autoIncrement.plugin, 'SocialMediaNotification');

module.exports = mongoose.model('SocialMediaNotification', socialMediaNotificationSchema);
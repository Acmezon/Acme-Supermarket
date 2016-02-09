var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMediaRule = require('./social_media_rule'),
	autoIncrement = require('mongoose-auto-increment');

var socialMediaNotificationSchema = mongoose.Schema({
	percentageExceeded: {type: Number, required: true, min: 0, required: true},
	moment: {type: Date, default: Date.now, required: true},
}, {collection: 'social_media_notifications', discriminatorKey: '_type'});

socialMediaNotificationSchema.plugin(autoIncrement.plugin, 'SocialMediaNotification');

exports.schema = socialMediaNotificationSchema;

module.exports = mongoose.model('SocialMediaNotification', socialMediaNotificationSchema);
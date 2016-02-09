var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var	autoIncrement = require('mongoose-auto-increment'),
	SocialMediaNotification = require('./social_media_notification');

var socialMediaRuleSchema = mongoose.Schema({
	increaseRate: {type: Number, required: true, min: 0}
}, {collection: 'social_media_rules', discriminatorKey: '_type'});

socialMediaRuleSchema.plugin(autoIncrement.plugin, 'SocialMediaRule');

exports.schema = socialMediaRuleSchema;

module.exports = mongoose.model('SocialMediaRule', socialMediaRuleSchema);
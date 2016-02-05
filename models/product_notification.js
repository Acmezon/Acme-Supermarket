var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	ProductRule = require('./product_rule'),
	SocialMediaNotification = require('./social_media_notification');

var productNotificationSchema = SocialMediaNotification.schema.extend({
	product_id : {type: Number, ref:'Product', required: true},
	product_rule_id :  {type: Number, ref:'ProductRule', required: true}
});

module.exports = mongoose.model('ProductNotification', productNotificationSchema);
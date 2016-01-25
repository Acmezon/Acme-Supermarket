var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaBrandDataSchema = mongoose.Schema({
	date: Date,
	description: String,
}, {collection: 'social_media_brand_data'});

module.exports = mongoose.model('SocialMediaBrandData', socialMediaBrandDataSchema);
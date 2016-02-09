var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaBrandDataSchema = mongoose.Schema({
	date: {type: Date, default: Date.now, required: true},
	description: String,
}, {collection: 'social_media_brand_data'});

module.exports = mongoose.model('SocialMediaBrandData', socialMediaBrandDataSchema);
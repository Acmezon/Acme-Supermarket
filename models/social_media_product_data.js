var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaProductDataSchema = mongoose.Schema({
	date: Date,
	description: String,
	product_id: Number
}, {collection: 'social_media_product_data'});

module.exports = mongoose.model('SocialMediaProductData', socialMediaProductDataSchema);
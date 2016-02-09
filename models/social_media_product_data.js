var mongoose = require('mongoose');
var Schema = mongoose.Schema
	Product = require('./product');

var socialMediaProductDataSchema = mongoose.Schema({
	date: {type: Date, default: Date.now, required: true},
	description: String,
	product_id: {type: Number, ref: 'Product', required: true}
}, {collection: 'social_media_product_data'});

module.exports = mongoose.model('SocialMediaProductData', socialMediaProductDataSchema);
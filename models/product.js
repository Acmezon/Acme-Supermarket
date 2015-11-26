var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Product', new Schema({
		name: String,
		description: String,
		code: String,
		price: {type:Number,min:0},
		rating: {type:Number,min:0,max:5},
		image: String
	})
);
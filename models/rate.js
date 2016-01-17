var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./product'),
	Customer = require('./customer');



var rateSchema = mongoose.Schema({
	rate: {type:Number,min:0,max:5, required: true},
	product_id: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},,
	customer_id: {type: mongoose.Schema.Types.ObjectId, ref:'Customer'}
});


module.exports = mongoose.model('Rate', rateSchema);
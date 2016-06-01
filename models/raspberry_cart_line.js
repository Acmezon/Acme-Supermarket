var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raspberryCartLineSchema = mongoose.Schema({
	provide_id : {type: Number, ref:'Provide', required: true},
	quantity: {type: Number, required: true, default: 1, min: 1, max: 100},
	customer_id: {type: Number, ref: 'Customer', required: true}
}, {collection: 'raspberry_cart_lines'});

module.exports = mongoose.model('RaspberryCartLine', raspberryCartLineSchema);
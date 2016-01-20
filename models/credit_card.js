var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	autoIncrement = require('mongoose-auto-increment');


var creditCardSchema = new mongoose.Schema({
	holderName: {type: String, required:true},
	number: {type: String, required:true, validate: {
		validator: function(v) {
			return /^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(v) ||
				/^5[1-5][0-9]{14}$/.test(v) || 
				/^3[47][0-9]{13}$/.test(v) || 
				/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(v) || 
				/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(v) || 
				/^(?:2131|1800|35\d{3})\d{11})$/.test(v);
		}
    }},
	expirationMonth: {type:Number,min:1, max:12, required: true},
	expirationYear: {type:Number,min:2000, max:3000, required: true},
	cvcCode: {type:Number,min:100, max:9999, required: true}
});

creditCardSchema.plugin(autoIncrement.plugin, 'Credit_card');

module.exports = mongoose.model('Credit_card', creditCardSchema);
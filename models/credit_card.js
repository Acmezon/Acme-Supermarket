var mongoose = require('mongoose'),
	validators = require('mongoose-validators');


var creditCardSchema = new mongoose.Schema({
	holderName: {type: String, required:true},
	brandName: {type: String, required:true},
	number: {type: String, required:true, validate: {
		validator: function(v) {
			return /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/.test(v) || /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/.test(v);
		},
		message: '{VALUE} is not a valid phone number!'
    }},
	expirationMonth: {type:Number,min:1, max:12, required: true},
	expirationYear: {type:Number,min:2000, max:3000, required: true},
	cwCode: {type:Number,min:100, max:999, required: true}
});

/*
//Visa -> 16 digitos, pueden contener guiones "-"  cadaa 4 digitos o no
 /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/

//MasterCard
 /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/
*/


module.exports = mongoose.model('Credit_card', creditCardSchema);
var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor');

var customerSchema = Actor.schema.extend({
	coordinates: {
		type: String, 
		required: true,  
		validate: {
			validator: function(v) {
				return /^(\-?\d+(\.\d+)?);(\-?\d+(\.\d+)?)$/.test(v);
			}
		}
	},
	credit_card_id: Number,
	address: {type: String, required: true},
	country: {type: String, required: true},
	city: {type: String, required: true},
	phone: {type: String, required: true, validate: validators.isLength(9, 15)}
});

module.exports = mongoose.model('Customer', customerSchema);

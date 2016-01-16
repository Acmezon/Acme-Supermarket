var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor');

var supplierSchema = Actor.schema.extend({
	address: {type: String, required: true},
	coordinates: {
		type: String, 
		required: true,  
		validate: {
			validator: function(v) {
				return /^(\-?\d+(\.\d+)?);(\-?\d+(\.\d+)?)$/.test(v);
			}
		}
	},
	reputation: {type:Number,min:0,max:5, required: true}
});

module.exports = mongoose.model('Supplier', supplierSchema);

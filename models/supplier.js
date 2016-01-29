var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor');

var supplierSchema = Actor.schema.extend({
	coordinates: {
		type: String, 
		required: true,  
		validate: {
			validator: function(v) {
				return /^(\-?\d+(\.\d+)?);(\-?\d+(\.\d+)?)$/.test(v);
			}
		}
	},
	address: {type: String, required: true}
});

module.exports = mongoose.model('Supplier', supplierSchema);

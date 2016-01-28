var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor'),
	Provide = require('./provide');

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

supplierSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Sus provides

	Provide.remove( { supplier_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
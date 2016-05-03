var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	extend = require('mongoose-schema-extend'),
	Actor = require('./actor'),
	CreditCard = require('./credit_card'),
	PurchasingRule = require('./purchasing_rule'),
	Reputation = require('./reputation'),
	Rate = require('./rate');

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
	credit_card_id: {type: Number, ref: 'CreditCard'},
	address: {type: String, required: true},
	country: {type: String, required: true},
	city: {type: String, required: true},
	phone: {type: String, required: true, validate: validators.isLength(9, 15)},
	timeWindow: {type: String, required: true, enum:['MORNING', 'AFTERNOON', 'BOTH'], default:'BOTH'}
});

module.exports = mongoose.model('Customer', customerSchema);

customerSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Sus tarjetas de crédito
	//	Sus reglas de compra
	//	Sus valoraciones a provides
	//	Sus valoraciones a productos

	CreditCard.remove( { customer_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			PurchasingRule.remove( { customer_id: this.id } ).exec(function (err) {
				if(err) {
					done(err);
				} else {
					Reputation.remove( { customer_id: this.id } ).exec(function (err) {
						if(err) {
							done(err);
						} else {
							Rate.remove( { customer_id: this.id } ).exec(function (err) {
								if (err){
									done(err);
								} else {
									next();
								}
							})
						}
					})
				}
			})
		}
	});
});
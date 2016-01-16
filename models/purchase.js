var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Customer = require('./customer');



var purchaseSchema = mongoose.Schema({
	deliveryDate: {type: Date, required:true},
	paymentDate: {type: Date, required:true},
	customer_id: {type: mongoose.Schema.Types.ObjectId, ref:'Customer'}
});


module.exports = mongoose.model('Purchase', purchaseSchema);
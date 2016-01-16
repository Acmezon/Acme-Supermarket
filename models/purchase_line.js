var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var purchaseLineSchema = mongoose.Schema({
	quantity: {type: Number, required:true, min:1, max:999},
	purchase_id: {type: mongoose.Schema.Types.ObjectId, ref:'purchaseSchema'},
	provide_id: {type: mongoose.Schema.Types.ObjectId, ref:'provideSchema'}
});


module.exports = mongoose.model('PurchaseLine', purchaseLineSchema);
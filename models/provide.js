var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var provideSchema = mongoose.Schema({
	price: {type: Number, required:true, min:0, get: getPrice, set:setPrice},
	product_id : {type: mongoose.Schema.Types.ObjectId, ref:'productSchema'},
	supplier_id : {type: mongoose.Schema.Types.ObjectId, ref:'supplierSchema'}
});

// Store price as cents. Avoid rare storage
function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}


module.exports = mongoose.model('Provide', provideSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supplier_dim = mongoose.Schema({
	supplier_id : {type: Number},
	email : {type: String},
	name : {type: String},
	surname : {type: String}
}, {collection: 'supplier_dim'});

module.exports = mongoose.model('supplier_dim', supplier_dim);
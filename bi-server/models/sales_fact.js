var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sales_fact = mongoose.Schema({
	time_id : {type: String},
	product_id : {type: Number},
	supplier_id : {type: Number},
	unit_cost : {type: Number},
	quantity : {type: Number},
	total_cost : {type: Number}
}, {collection: 'sales_fact'});

module.exports = mongoose.model('sales_fact', sales_fact);
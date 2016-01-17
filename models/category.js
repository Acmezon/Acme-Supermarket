var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var categorySchema = mongoose.Schema({
	name: String
}, {collection: 'categories'});


module.exports = mongoose.model('Category', categorySchema);
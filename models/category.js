var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var categorySchema = mongoose.Schema({
	name: String
});


module.exports = mongoose.model('Category', categorySchema);
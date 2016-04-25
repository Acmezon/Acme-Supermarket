var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rule = mongoose.Schema({
	antecedents: [{type : Number}],
	consequent_id : {type: Number}
}, {collection: 'rules'});

module.exports = mongoose.model('rule', rule);
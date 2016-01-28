var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment')
	BelongsTo = require('./belongs_to');

var categorySchema = mongoose.Schema({
	name: {type: String, required: true}
}, {collection: 'categories'});

categorySchema.plugin(autoIncrement.plugin, 'Category');

module.exports = mongoose.model('Category', categorySchema);

categorySchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las pertenencias de productos a esta categoria

	BelongsTo.remove( { category_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			next();
		}
	});
});
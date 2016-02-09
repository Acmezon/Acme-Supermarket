var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	Rate = require('./rate'),
	SocialMediaRule = require('./social_media_rule')
	IsOver = require('./is_over'),
	SocialMediaProductData = require('./social_media_product_data'),
	BelongsTo = require('./belongs_to'),
	Provide = require('./provide'),
	random = require('mongoose-simple-random'),
	textSearch = require("mongoose-text-search");;

var productSchema = mongoose.Schema({
	name: {type: String, required: true, minlength: 1, maxlength: 100},
	description: {type: String, required: true, maxlength: 1000},
	code: {type: String, required: true, unique:true},
	image: String,
	keywords: [String],
	minPrice: {type: Number, required:false, min:0},
	maxPrice: {type: Number, required:false, min:0},
	avgRating: {type: Number, required:false, min:0, max:5}
})

productSchema.plugin(autoIncrement.plugin, 'Product');
productSchema.plugin(random);
productSchema.plugin(textSearch);

productSchema.index({
	keywords : "text"
});

module.exports = mongoose.model('Product', productSchema);

productSchema.pre('save', function (next, done) {
	this.keywords = this.name.split(" ");
	next();
});

productSchema.pre('remove', function (next, done) {
	//Eliminar:
	//	Las valoraciones que ha recibido
	//	Las reglas de redes sociales que le implican
	//	Las relaciones "isOver" de los cupones de descuento que le impliquen
	//	Los datos de ocurrencia en redes sociales del producto en cuestión
	//	Las relaciones "belongsTo" a las categorías que le implican
	//	Los provide que lo implican

	Rate.remove( { product_id: this.id } ).exec(function (err) {
		if(err) {
			done(err);
		} else {
			SocialMediaRule.remove( { product_id: this.id } ).exec(function (err) {
				if(err) {
					done(err);
				} else {
					IsOver.remove( { product_id: this.id } ).exec(function (err) {
						if(err) {
							done(err);
						} else {
							SocialMediaProductData.remove( { product_id: this.id } ).exec(function (err) {
								if (err){
									done(err);
								} else {
									BelongsTo.remove( { product_id : this.id } ).exec(function (err) {
										if(err) {
											done(err);
										} else {
											Provide.remove( { product_id : this.id } ).exec(function (err) {
												if(err) {
													done(err);
												} else {
													next();
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

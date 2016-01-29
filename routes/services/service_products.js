var Product = require('../../models/product');
var Rate = require('../../models/rate');
var Provide = require('../../models/provide');
var fs = require('fs');

// Update the avgRating of product with id
exports.updateAverageRating = function(product_id, callback) {
	Rate.find({product_id: product_id}, function (err, rates) {
		if (err) {
			callback(false);
		} else {
			if (rates.length) {
				var total = 0;
				rates.forEach(function (rate) {
					total += rate.value;
				});
				var avg = total/rates.length;
				Product.update({_id: product_id}, { $set: { avgRating: avg}}, function (err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			} else {
				callback(true);
			}
		}
	});
}

// Update min and Max price
exports.updateMinMaxPrice = function(product_id, callback) {
	Provide.find({product_id: product_id, deleted: false}, function (err, provides) {
		if (err) {
			callback(false);
		} else {
			if (provides.length) {
				var lowest = Number.POSITIVE_INFINITY;
				var highest = Number.NEGATIVE_INFINITY;
				var tmp;
				for (var i = provides.length - 1; i >= 0; i--) {
				    tmp = provides[i].price;
				    if (tmp < lowest) lowest = tmp;
				    if (tmp > highest) highest = tmp;
				}
				Product.update({_id: product_id}, { $set: {minPrice: lowest, maxPrice: highest}}, function (err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			} else {
				callback(true);
			}
		}
	});
}

exports.removeProduct = function(product_id, callback) {
	Product.remove({ _id : product_id}, function (err){
		if(err) {
			console.log(err);
			callback(false);
		}

		callback(true);
	});
}

exports.removeProductAndImage = function(product_id, image, callback) {
	fs.unlink('public/img/' + image, function (err) {
		if(err) {
			console.log(err);
			callback(false);
		} else {
			Product.remove({ _id : product_id}, function (err){
				if(err) {
					console.log(err);
					callback(false);
				}

				callback(true);
			});
		}
	});
}

exports.getProductByProvideId = function(provide_id, callback) {
	Provide.findById(provide_id, function (err, provide) {
		if(err) {
			callback(err);
		} else {
			Product.findById(provide.product_id, function (err, product) {
				if(err) {
					callback(err);
				} else {
					callback(null, product);
				}
			})
		}
	});
}
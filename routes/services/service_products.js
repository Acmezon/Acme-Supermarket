var Product = require('../../models/product'),
	Rate = require('../../models/rate'),
	Provide = require('../../models/provide'),
	BelongsTo = require('../../models/belongs_to'),
	fs = require('fs'),
	sync = require('synchronize'),
	db_utils = require('../db_utils');

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

exports.getProductsFilteredForSupplier = 
function(ordering_sort, ordering_order, 
		ordering_currentPage, ordering_pageSize, 
		filter_id_category, filter_maxPrice, 
		filter_minRating, filter_maxRating, 
		filter_text, is_count, 
		aux_coll, callback) {

	filterProducts(ordering_sort,
		ordering_order, ordering_currentPage,
		ordering_pageSize, filter_id_category,
		filter_maxPrice, filter_minRating,
		filter_maxRating, filter_text,
		is_count, aux_coll, callback);

};

exports.getProductsFiltered = 
function(ordering_sort, 
		ordering_order, ordering_currentPage, 
		ordering_pageSize, filter_id_category, 
		filter_maxPrice, filter_minRating, 
		filter_maxRating, filter_text, 
		is_count, callback) {

	filterProducts(ordering_sort,
		ordering_order, ordering_currentPage,
		ordering_pageSize, filter_id_category,
		filter_maxPrice, filter_minRating,
		filter_maxRating, filter_text,
		is_count, [], callback);	
}
 
function filterProducts(ordering_sort, 
		ordering_order, ordering_currentPage, 
		ordering_pageSize, filter_id_category, 
		filter_maxPrice, filter_minRating, 
		filter_maxRating, filter_text, 
		is_count, initial, callback) {

	var ord_tuple = {};
	ord_tuple[ordering_sort] = ordering_order;

	sync.fiber(function () {
		var ProductsQuery = Product.find();

		if(filter_id_category != -1 || initial.length) {
			var supplier_products = [];
			if(initial.length) {
				supplier_products = initial;
			}

			var products_in_category = [];
			if(filter_id_category != -1){
				var products_in_category = sync.await(BelongsTo.find({ 'category_id' : filter_id_category }, 'product_id -_id', sync.defer()));
				products_in_category = products_in_category.map(function (object) { return object.product_id });
			}

			var product_ids = [];
			if(products_in_category.length && supplier_products.length) {
				product_ids = db_utils.intersect_safe(products_in_category, supplier_products);
			} else if(products_in_category.length) {
				product_ids = products_in_category;
			} else {
				product_ids = supplier_products;
			}

			ProductsQuery.where({ '_id' : { $in : product_ids } });
		}

		if (filter_maxPrice != -1) {
			ProductsQuery.where({
				maxPrice: {
					$lt: filter_maxPrice
				}
			});
		}

		if(filter_text) {
			ProductsQuery.where({
				$text : { $search: filter_text }
			})
		}

		var final_filter = {
			avgRating : {
				$gte: filter_minRating,
				$lt: filter_maxRating
			}
		};

		if(is_count) {
			var count = sync.await(ProductsQuery.count(final_filter).exec(sync.defer()));

			return count;
		} else {
			ProductsQuery.where(final_filter)
			.select({
				'_id' : 1,
				'name' : 1,
				'image': 1,
				'minPrice': 1,
				'maxPrice': 1,
				'avgRating': 1
			})
			.sort(ord_tuple)
			.skip(ordering_pageSize * ordering_currentPage)
			.limit(ordering_pageSize);

			var products = sync.await(ProductsQuery.exec(sync.defer()));
			return products;
		}
	}, function (err, res) {
		callback(err, res);
	});
}

// Returns a product with barcode
exports.getProductByBarcode = function(barcode, callback) {
	Product.findOne({ code: barcode})
	.exec(function (err, product) {
		if (err) {
			callback(null)
		} else {
			callback(product);
		}
	});
}
var db_utils = require('./db_utils');
var Product = require('../models/product');
var multer  = require('multer');
var fs = require('fs');
var Authentication = require('./authentication'),
	Rate = require('../models/rate'),
	Actor = require('../models/actor'),
	Customer = require('../models/customer'),
	Provide = require('../models/provide'),
	BelongsTo = require('../models/belongs_to'),
	PurchaseLine = require('../models/purchase_line'),
	Purchase = require('../models/purchase'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers'),
	ProductService = require('./services/service_products'),
	RecommenderService = require('./services/service_recommender_server'),
	async = require('async');

// Returns all objects of the system, filtered
exports.getAllProductsFiltered = function(req, res) {
	console.log('Function-productsApi-getAllProductsFiltered');

	var ordering_sort = req.body.sort,
		ordering_order = parseInt(req.body.order) || 1,
		ordering_currentPage = parseInt(req.body.currentPage) || 0,
		ordering_pageSize = parseInt(req.body.pageSize) || 9,
		filter_id_category = parseInt(req.body.categoryFilter) || null,
		filter_maxPrice = req.body.priceFilter ? parseInt(req.body.priceFilter) || -1 : -1,
		filter_minRating = parseInt(req.body.ratingFilter) || 0,
		filter_maxRating = filter_minRating==0 ? 5 : parseInt(req.body.ratingFilter) + 1 || 5;

	// Format sort criteria
	if (ordering_sort == 'rating') {
		ordering_sort = 'avgRating';
	} else {
		if (ordering_sort == 'price') {
			ordering_sort = 'minPrice';
		} else {
			ordering_sort = 'name';
		}
	}

	var ord_tuple = {};
	ord_tuple[ordering_sort] = ordering_order;

	if (filter_id_category != -1){
		// CATEGORY FILTER ACTIVATED
		BelongsTo.find({
			'category_id': filter_id_category
		}).select('product_id').exec(function(err, product_ids) {
			if (err) {
				res.status(500).json({
					success: false,
					message: err
				});
			} else {
				// CONTINUE
				if (filter_maxPrice != -1) {
					// PRICE FILTER ACTIVATED
					Product.find({
							maxPrice: {
								$lt: filter_maxPrice
							},
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
							'_id': {
								$in: product_ids
							}
						}).select({'_id':1, 'name':1, 'image':1, 'minPrice':1, 'maxPrice':1, 'avgRating':1})
						.sort(ord_tuple).skip(ordering_pageSize * ordering_currentPage).limit(ordering_pageSize)
						.exec(function(err, products) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(products);
							}
						});
				} else {
					// PRICE FILTER DEACTIVATED
					Product.find({
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
							'_id': {
								$in: product_ids
							}
						}).select({'_id':1, 'name':1, 'image':1, 'minPrice':1, 'maxPrice':1, 'avgRating':1})
						.sort(ord_tuple).skip(ordering_pageSize * ordering_currentPage).limit(ordering_pageSize)
						.exec(function(err, products) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(products);
							}
						});
				}
			}
		});
	} else {
		// CATEGORY FILTER DEACTIVATED
				if (filter_maxPrice != -1) {
					// PRICE FILTER ACTIVATED
					Product.find({
							maxPrice: {
								$lt: filter_maxPrice
							},
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
						}).select({'_id':1, 'name':1, 'image':1, 'minPrice':1, 'maxPrice':1, 'avgRating':1})
						.sort(ord_tuple).skip(ordering_pageSize * ordering_currentPage).limit(ordering_pageSize)
						.exec(function(err, products) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(products);
							}
						});
				} else {
					// PRICE FILTER DEACTIVATED
					Product.find({
						avgRating: {
							$gte: filter_minRating,
							$lt: filter_maxRating
						},
					}).select({'_id':1, 'name':1, 'image':1, 'minPrice':1, 'maxPrice':1, 'avgRating':1})
					.sort(ord_tuple).skip(ordering_pageSize * ordering_currentPage).limit(ordering_pageSize)
					.exec(function(err, products) {
						if (err) {
							res.status(500).json({
								success: false,
								message: err
							});
						} else {
							res.status(200).json(products);
						}
					});
				}
	}
};

// Returns number of objects of the system, filtered
exports.countProductsFiltered = function(req, res) {
	console.log('Function-productsApi-countProductsFiltered');

	var filter_id_category = parseInt(req.body.categoryFilter) || null,
		filter_maxPrice = req.body.priceFilter ? parseInt(req.body.priceFilter) || -1 : -1,
		filter_minRating = parseInt(req.body.ratingFilter) || 0,
		filter_maxRating = filter_minRating==0 ? 5 : parseInt(req.body.ratingFilter) + 1 || 5;

	if (filter_id_category != -1){
		// CATEGORY FILTER ACTIVATED
		BelongsTo.find({
			'category_id': filter_id_category
		}).select('product_id').exec(function(err, product_ids) {
			if (err) {
				res.status(500).json({
					success: false,
					message: err
				});
			} else {
				// CONTINUE
				if (filter_maxPrice != -1) {
					// PRICE FILTER ACTIVATED
					Product.count({
							maxPrice: {
								$lt: filter_maxPrice
							},
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
							'_id': {
								$in: product_ids
							}
						}).exec(function(err, number) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(number);
							}
						});
				} else {
					// PRICE FILTER DEACTIVATED
					Product.count({
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
							'_id': {
								$in: product_ids
							}
						}).exec(function(err, number) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(number);
							}
						});
				}
			}
		});
	} else {
		// CATEGORY FILTER DEACTIVATED
				if (filter_maxPrice != -1) {
					// PRICE FILTER ACTIVATED
					Product.count({
							maxPrice: {
								$lt: filter_maxPrice
							},
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
						}).exec(function(err, number) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(number);
							}
						});
				} else {
					// PRICE FILTER DEACTIVATED
					Product.count({
							avgRating: {
								$gte: filter_minRating,
								$lt: filter_maxRating
							},
						}).exec(function(err, number) {
							if (err) {
								res.status(500).json({
									success: false,
									message: err
								});
							} else {
								res.status(200).json(number);
							}
						});
				}
	}

};

// Return collection of limited products: Used in home page.
exports.getAllProductsLimit = function(req, res) {
	var limit = parseInt(req.params.limit);
	console.log('Function-productsApi-getAllProductsLimit  -- limit:' + limit);

	// Find no conditions
	Product.find().limit(limit).exec(function (err, products){
		if(err){
			res.status(500).json({success: false, message: err});
		}else{
			res.status(200).json(products);
		}
	});
}


// Returns a product object identified by ID
exports.getProduct = function (req, res) {
	var _code = req.params.id;
	console.log('Function-productsApi-getProduct  --_id:'+_code);

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='admin' || role=='supplier') {
			Product.findById( _code,function(err,product){
				if(err){
					console.log('---ERROR finding Product: '+_code);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(product);
					res.status(200).json(product);
				}
			});
		} else {
			res.status(401).json({success: false, message: "Not authenticated"});
		}
	});	
};

// Updates a product
exports.updateProduct = function (req, res) {
	console.log('Function-productsApi-updateProduct  --_id:'+req.body.id);
	var set = {}
	set[req.body.field] = req.body.data;

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			Product.findByIdAndUpdate(req.body.id, { $set: set}, function (err, product) {
				if(err){
					console.log(err);
					res.status(500).send("Unable to save field, check input.")
				} else {
					res.status(200).json({success: true});
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Updates a product with a new image
exports.updateProductImage = function (req, res) {
	var filename = "";
	var prev_img = "";

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			// Start upload process

			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, 'public/img/')
				},
				filename: function (req, file, cb) {
					var originalExtension = file.originalname.split(".")[file.originalname.split(".").length - 1]
					
					filename = req.body.p_id + "." + originalExtension;

					cb(null, filename);
				}
			});
			var upload = multer({ storage: storage }).single('file');

			upload(req, res, function (err) {
				if (err) {
					res.status(500).send("{{ 'Product.UploadError' | translate }}");
					return;
				}

				Product.findOne(req.body.p_id, function (err, product) {
					if(err) {
						res.status(500).send("{{ 'Product.UploadError' | translate }}");
						return;
					}

					prev_img = product.image;
				})

				Product.findByIdAndUpdate(req.body.p_id, { $set: { "image" : filename} }, function (err, product) {
					if(err){
						console.log(err);
						
						fs.unlinkSync('/public/img/' + filename);

						res.status(500).send("{{ 'Product.UploadError' | translate }}");
					} else {
						fs.access('/public/img/' + prev_img, fs.F_OK, function(err) {
							if (!err) {
								fs.unlinkSync('/public/img/' + prev_img);
							}
						});
						res.status(200).json({success: true});
					}
				});
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Creates a product
exports.createProduct = function (req, res) {
	var filename = "";

	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			var product = new Product({
				'code' : mongoose.Types.ObjectId(),
				'name' : "tmp",
				'description' : "tmp",
				'avgRating' : 0
			});
			product.save(function (err, saved){
				if(err) {
					console.log(err);
					res.sendStatus(500);
				}

				var storage = multer.diskStorage({
					destination: function (req, file, cb) {
						cb(null, 'public/img/')
					},
					filename: function (req, file, cb) {
						var originalExtension = file.originalname.split(".")[file.originalname.split(".").length - 1]
						
						filename = saved.id + "." + originalExtension;

						cb(null, filename);
					}
				});

				var upload = multer({ storage: storage }).single('file');
				upload(req, res, function (err) {
					if (err) {
						res.sendStatus(500);
						return;
					}

					Product.findByIdAndUpdate(saved.id, 
						{ 
							$set: { 
								"name" : req.body.name,
								"description" : req.body.description,
								"image" : filename
							} 
						}, function (err, product) {
						if(err){
							console.log(err);
							
							fs.unlinkSync('/public/img/' + filename);

							res.sendStatus(500);
						} else {
							res.sendStatus(200);
						}
					});
				});
			});
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
};

// Update a product with a new/edited rating
exports.updateProductRating = function (req, res) {
	var product_id = req.body.id;
	var rating_value = req.body.rating;

	CustomerService.getPrincipalCustomer(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == null) {
			res.status(403).json({success: false, message: "Doesnt have permission"});
			return;
		} else {
			CustomerService.checkPurchasing(user, product_id, function (response) {
				if(!response) {
					res.sendStatus(401)
					return;
				}
				Rate.findOne({ customer_id : user.id }, function (err, rate) {
					if(err) {
						res.sendStatus(503);
						return;
					} else {
						if(rate) {
							// Rate found: Update
							Rate.findByIdAndUpdate(rate._id, { $set : { rate : rating_value } }, function (err, updated) {
								if (err) {
									res.sendStatus(503);
									return;
								} else {
									// Update average rating and recalculate recommendations
									ProductService.updateAverageRating(product_id, function (success) {
										if(!success){
											console.log("Ratings not updated");
										} else {
											RecommenderService.recommendRates(user.id, function (err, response){
												if(err || response.statusCode == 500) {
													console.log("No recommendations updated");
												} else {
													res.sendStatus(200);
													return;
												}
											});
										}
									});
								}
							});
						} else {
							// Rate not found: Create new one
							var new_rate = new Rate({
								rate: rating_value,
								product_id : product_id,
								customer_id : user.id
							});

							Rate.newRate(new_rate, function (err) {
								if (err) {
									res.sendStatus(503);
									return;
								} else {
									ProductService.updateAverageRating(product_id, function (success) {
										if(!success){
											console.log("Ratings not updated");
										} else {
											RecommenderService.recommendRates(user.id, function (err, response){
												if(err || response.statusCode == 500) {
													console.log("No recommendation updated")
												} else {
													res.sendStatus(200);
													return;
												}
											});
										}
									});
								}
							});
						}
					}
				});
			});
		}
	});
};

// Returns true if current customer has purchased a product req.body.product
exports.userHasPurchased = function (req, res) {
	ActorService.getPrincipal(req.cookies.session, req.app.get('superSecret'), function (pair) {
		if(pair==-1) {
			res.status(403).json({success: false, message: "Doesn't have permission"});
			return;
		} else {
			Customer.findOne({ email : pair[0]}, function (err, customer) {
				if(err) {
					res.sendStatus(503);
					return;
				} else {
					CustomerService.checkPurchasing(customer, req.body.product, function (response){
						res.status(200).json({ hasPurchased : response });
					});
					return;
				}
			});
		}
	});
};

//Returs a json with all the products identified by all the IDs received in a list
exports.getProductsByIdList = function (req, res) {
	var products = req.body.products.data;
	var products_json = [];

	async.each(products, function (product, callback) {
		var p_id = product.product_id;

		Product.findById( p_id,function (err, prd){
			if(err){
				console.log('---ERROR finding Product: '+p_id);
			}else{
				products_json.push(prd);
				callback();
			}
		});

	}, function (error) {
		if(error) res.sendStatus(500);

		res.status(200).json(products_json);
	});
}


//Deletes a product
exports.deleteProduct = function (req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;

	// Check principal is customer or administrator
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin') {
			var product_id = req.params.id;
			if(product_id != undefined) {
				Product.findOne( {_id : product_id}, function (err, product) {
					if(err){
						console.log(err);
						res.sendStatus(500);
					}

					if(!product){
						console.log("No product");
						res.sendStatus(404);
					}

					var image = product.image;

					if(image == "default.jpg") {
						ProductService.removeProduct(product_id, function (success) {
							if(success){
								res.sendStatus(200);
							} else {
								res.sendStatus(500);
							}
						});
					} else {
						ProductService.removeProductAndImage(product_id, image, function (success) {
							if(success){
								res.sendStatus(200);
							} else {
								res.sendStatus(500);
							}
						});
					}
				});
			} else {
				console.log("No product");
				res.sendStatus(500);
			}
		} else {
			res.status(403).json({success: false, message: "Doesnt have permission"});
		}
	});
}
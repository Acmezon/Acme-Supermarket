var db_utils = require('./db_utils');
var Product = require('../models/product');
var multer  = require('multer');
var fs = require('fs');
var Authentication = require('./authentication'),
	Rate = require('../models/rate'),
	Actor = require('../models/actor'),
	Customer = require('../models/customer'),
	Provide = require('../models/provide'),
	PurchaseLine = require('../models/purchase_line'),
	Purchase = require('../models/purchase'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers');

// Returns all objects of the system
exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');

	// Find no conditions
	Product.find(function(err,products){
		if(err){
			res.status(500).json({success: false, message: err.errors});
		}else{
			res.status(200).json(products);
		}
	});
};


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
					res.status(500).json({success: false, message: err.errors});
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

// Update a product with a new/edited rating
exports.updateProductRating = function (req, res) {
	Authentication.currentUser(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == -1) {
			res.status(403).json({success: false, message: "Doesnt have permission"});
			return;
		} else {
			Actor.findOne({ email : user}, function (err, actor) {
				var u_id = actor._id;

				CustomerService.checkPurchasing(u_id, req.body.id, function (response) {
					if(!response) {
						res.sendStatus(401)
						return;
					}
					Rate.findOne({ customer_id : u_id }, function (err, rate) {
						if(err) {
							res.sendStatus(503);
							return;
						} else {
							if(rate) {
								Rate.findByIdAndUpdate(rate._id, { $set : { rate : req.body.rating } }, function (err, updated) {
									if (err) {
										res.sendStatus(503);
										return;
									} else {
										res.sendStatus(200);
										return;
									}
								});
							} else {
								var new_rate = new Rate({
									rate: req.body.rating,
									product_id : req.body.id,
									customer_id : customer_id
								});

								Rate.newRate(new_rate, function (err) {
									if (err) {
										res.sendStatus(503);
										return;
									} else {
										res.sendStatus(200);
										return;
									}
								});
							}
						}
					});
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
					CustomerService.checkPurchasing(customer._id, req.body.product, function (response){
						res.status(200).json({ hasPurchased : response });
					});
					return;
				}
			});
		}
	});
};
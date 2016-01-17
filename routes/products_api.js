//var crypto = require('crypto');//Necesario para encriptacion por MD5

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
	Purchase = require('../models/purchase');

//Devuelve una lista con todos los productos de la coleccion
exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');

	//Find sin condiciones
	Product.find(function(err,products){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors.length > 0){
			console.log('---ERROR finding AllProduct - message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			res.status(200).json(products);
		}
	});
};


//Devuelve un producto de la coleccion
exports.getProduct = function (req, res) {
	console.log('Function-productsApi-getProduct');


	var _code = req.params.id;
	console.log('GET /api/product/'+_code)

	Product.findById( _code,function(err,product){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors.length > 0){
			console.log('---ERROR finding Product: '+_code+' message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			//console.log(product);
			res.status(200).json(product);
		}
	});
};

exports.updateProduct = function (req, res) {
	var set = {}
	set[req.body.field] = req.body.data;

	Product.findByIdAndUpdate(req.body.id, { $set: set}, function (err, product) {
		if(err){
			console.log(err);
			res.status(500).send("Unable to save field, check input.")
		} else {
			res.status(200).json({success: true});
		}
	});
};

exports.updateProductImage = function (req, res) {
	var filename = "";
	var prev_img = "";

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
	})
};

exports.updateProductRating = function (req, res) {
	Authentication.currentUser(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == -1) {
			res.sendStatus(403);
			return;
		} else {
			Actor.findOne({ email : user}, function (err, actor) {
				var u_id = actor._id;

				checkPurchasing(u_id, req.body.id, function (response) {
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

exports.userHasPurchased = function (req, res) {
	Authentication.currentUser(req.cookies.session, req.app.get('superSecret'), function (user) {
		if(user == -1) {
			res.sendStatus(403);
			return;
		} else {
			Customer.findOne({ email : user}, function (err, customer) {
				if(err) {
					res.sendStatus(503);
					return;
				} else {
					checkPurchasing(customer._id, req.body.product, function (response){
						res.status(200).json({ hasPurchased : response });
					});
					return;
				}
			});
		}
	});
};


var checkPurchasing = function (user_id, product_id, callback) {
	Provide.find({ product_id : product_id }, function (err, provides) {
		if (err || provides.length == 0) {
			callback(false);
			return;
		}

		var provide_ids = [];

		for(var i = 0; i < provides.length; i++) {
			provide_ids.push(provides[i]._id);
		}

		PurchaseLine.find({ 'provide_id' : { $in: provide_ids } }, function (err, lines) {
			if(err || lines.length == 0) {
				callback(false);
				return;
			}

			var purchase_ids = [];

			for (var i = 0; i < lines.length; i++) {
				if(purchase_ids.indexOf(lines[i].purchase_id < 0))
					purchase_ids.push(lines[i].purchase_id);
			}

			Purchase.find({ '_id' : { $in : purchase_ids } }, function (err, purchases) {
				if(err || purchases.length == 0) {
					callback(false);
					return;
				}

				for(var i = 0; i < purchases.length; i++) {
					if ( String(purchases[i].customer_id) == String(user_id)) {
						callback(true);
						return;
					}
				}
				callback(false);
				return;
			});
		});
	});
}

exports.checkPurchasing = checkPurchasing;
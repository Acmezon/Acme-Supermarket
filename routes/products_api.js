//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_utils = require('./db_utils');
var Product = require('../models/product');
var multer  = require('multer');
var fs = require('fs');

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
	Product.findByIdAndUpdate(req.body.id, { $set: { "rating" : req.body.rating} }, function (err, product) {
		if(err){
			res.sendStatus(500);
		} else {
			res.status(200).json({success: true});
		}
	});
};
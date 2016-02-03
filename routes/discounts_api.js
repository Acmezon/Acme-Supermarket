var Discount = require('../models/discount'),
	IsOver = require('../models/is_over'),
	ActorService = require('./services/service_actors'),
	CouponCode = require('coupon-code');

// Returns all discount objects
exports.getDiscounts = function (req, res) {
	console.log("Function-discountsApi-getDiscounts");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.find()
				.exec (function (err, discounts) {
					if (err) {
						res.status(500).json({success: false})
					} else {
						res.status(200).json(discounts);
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Return number of products affected by discount id
exports.getNumberOfProductsAffected = function (req, res) {
	var id = req.params.id;
	console.log("Function-discountsApi-getNumberOfProductsAffected");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				IsOver.count({discount_id: id})
				.exec (function (err, number) {
					if (err) {
						res.status(500).json({success: false})
					} else {
						res.status(200).json(number);
					}
				});
			} else {
				res.status(403).json({success: false});
			}
		} else {
			res.status(401).json({success: false});
		}
	});
};

// Updates a discount
exports.updateDiscount = function (req, res) {
	var id = req.body.discount_id;
	var value = parseInt(req.body.value);
	console.log("Function-discountsApi-updateDiscount  --id: " + id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.update({ _id: id }, {$set: {value: value}},{ runValidators: true }, function(err) {
					    if (!err) {
					    	res.status(200).json({success: true});
					    }
					    else {
							res.status(500).json({success: false, message: err});
					    }
					});
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
}

// Deletes a discount
exports.deleteDiscount = function (req, res) {
	var id = req.body.id;
	console.log("Function-discountsApi-deleteDiscount  --id: " + id);

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				Discount.remove({ _id: id }, function(err) {
					    if (!err) {
					    	res.status(200).json({success: true});
					    }
					    else {
							res.status(500).json({success: false, message: err});
					    }
					});
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
};

// Generate a code and returns it.
exports.generateCode = function (req, res) {
	console.log("Function-discountsApi-generateCode");

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				var code = CouponCode.generate({ parts: 4 });
				res.status(200).json(code);
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});
};

// Creates a discount
exports.createDiscount = function (req, res) {
	console.log("Function-discountsApi-createDiscount");

	var value = parseInt(req.body.value) || 0,
		code = req.body.code;

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');

	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='supplier' || role=='customer') {
			if (role=='admin') {
				if(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code) &&
					CouponCode.validate(code, {parts: 4}).length){

					var newDiscount = Discount({
						code : code,
						value : value
					});

					newDiscount.save(function (err, savedDiscount) {
						if (err) {
							res.status(500).json({success: false});
						} else {
							res.status(200).json(savedDiscount)
						}
					});

				} else {
					// Wrond code format
					res.status(500).json({success: false});
				}
			} else {
				res.status(403).json({success: false});
			}
		} else {
		res.status(401).json({success: false});
		}
	});

	
}
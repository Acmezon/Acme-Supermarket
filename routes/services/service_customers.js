var Actor = require('../../models/actor'),
	Customer = require('../../models/customer'),
	Provide = require('../../models/provide'),
	Purchase = require('../../models/purchase'),
	PurchaseLine = require('../../models/purchase_line'),
	jwt = require('jsonwebtoken'),
	validator = require('validator');

// Returns true if principal is user_id or principal is an admin
exports.checkPrincipalOrAdmin = function(cookie, jwtKey, customer_id, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, actor){
						if (err) {
							callback(false);
						} else {
							var role = actor._type.toLowerCase();
							callback( (role=='admin') || (role=='customer' && actor._id==customer_id) );
						}
					});
				}
			});
		} else {
			callback(false);
		}
	} else {
		callback(false);
	}
}

// Returns a customer object for the principal
exports.getPrincipalCustomer = function(cookie, jwtKey, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(null);
				} else {
					Customer.findOne({
						email: decoded.email,
						_type: 'Customer'
					}, function (err, customer){
						if (err || !customer) {
							callback(null);
						} else {
							callback(customer);
						}
					});
				}
			});
		} else {
			callback(null);
		}
	} else {
		callback(null);
	}
}

// Returns true if principal is owner of credit_card_id passed or it is an admin
exports.checkOwnerOrAdmin = function(cookie, jwtKey, credit_card_id, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Actor.findOne({
						email: decoded.email
					}, function (err, actor){
						if (err) {
							callback(false);
						} else {
							var role = actor._type.toLowerCase();
							callback( (role=='admin') || (role=='customer' && actor.credit_card_id==credit_card_id) );
						}
					});
				}
			});
		}
	}
}

// Returns true if user has purchased product_id (via purchase_line)
exports.checkPurchasing = function (user, product_id, callback) {
	if (user) {
		if (user._type=='Customer') {
			Purchase.find({ customer_id: user._id}).select('_id').exec(function (err, purchases) {
				if(err) {
					callback(false);
				} else {
					var purchases_id = purchases.map(function (purchase) { return parseInt(purchase.id); });

					PurchaseLine.find({ product_id: product_id, purchase_id : { $in : purchases_id } }, function (err, purchase_lines) {
						if(err){
							callback(false);
						} else {
							callback(purchase_lines.length > 0);
						}
					});
				}
			});
		} else {
			callback(false)
			return;
		}
	} else {
		callback(false)
		return;
	}
}

//Returns true if the received user has purchased the provide received
exports.checkHasPurchasedProvide = function (user_id, provide_id, callback) {
	if (user_id) {
		PurchaseLine.find({ 'provide_id' : provide_id }, function (err, lines) {
			if(err || lines.length == 0) {
				callback(false);
				return;
			}

			var purchase_ids = lines.map(function (line) { return parseInt(line.purchase_id) });

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
	} else {
		callback(false)
		return;
	}
};

// Returns true if principal has purchased the purchase object
exports.checkHasPurchasedPurchase = function(cookie, jwtKey, purchase, callback) {
	if (cookie !== undefined) {
		var token = cookie.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, jwtKey, function(err, decoded) {
				if (err) {
					callback(false);
				} else {
					Customer.findOne({
						email: decoded.email
					}, function (err, customer){
						if (err) {
							callback(false);
						} else {
							callback(customer._id==purchase.customer_id);
						}
					});
				}
			});
		} else {
			callback(false);
		}
	} else {
		callback(false)
	}
}

// Returns true if signup customer form fields are correct
exports.checkFieldsCorrect = function(name, surname, email, password, coordinates, address, country, city, phone, timeWindow) {
	var countries = ["Afganistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Indian Ocean Ter", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Canary Islands", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Channel Islands", "Chile", "China", "Christmas Island", "Cocos Island", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote DIvoire", "Croatia", "Cuba", "Curaco", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Ter", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Great Britain", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guyana", "Haiti", "Hawaii", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea Sout", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malaysia", "Malawi", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nambia", "Nauru", "Nepal", "Netherland Antilles", "Netherlands", "Nevis", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Norway", "Oman", "Pakistan", "Palau Island", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Phillipines", "Pitcairn Island", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Montenegro", "Republic of Serbia", "Reunion", "Romania", "Russia", "Rwanda", "St Barthelemy", "St Eustatius", "St Helena", "St Kitts-Nevis", "St Lucia", "St Maarten", "St Pierre & Miquelon", "St Vincent & Grenadines", "Saipan", "Samoa", "Samoa American", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tahiti", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Is", "Tuvalu", "Uganda", "Ukraine", "United Arab Erimates", "United Kingdom", "United States of America", "Uraguay", "Uzbekistan", "Vanuatu", "Vatican City State", "Venezuela", "Vietnam", "Virgin Islands (Brit)", "Virgin Islands (USA)", "Wake Island", "Wallis & Futana Is", "Yemen", "Zaire", "Zambia", "Zimbabwe"];
	
	return validator.isEmail(email) &&
		password && password.length>=8 && password.length<=32 && 
		/^(\-?\d+(\.\d+)?);(\-?\d+(\.\d+)?)$/.test(coordinates) && 
		countries.indexOf(country) > -1 && 
		phone && phone.length >= 9 && phone.length <= 15 && 
		timeWindow && 
		(timeWindow == 'BOTH' || timeWindow == 'MORNING' || timeWindow == 'AFTERNOON');
}
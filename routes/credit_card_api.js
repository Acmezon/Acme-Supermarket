var CreditCard = require('../models/credit_card'),
	db_utils = require('./db_utils'),
	ActorService = require('./services/service_actors'),
	CustomerService = require('./services/service_customers');

//Syncronous
exports.newCreditCard = function (credit_card, callback) {
	credit_card.save(function (err) {
		console.log(err);
		callback(db_utils.handleInsertErrors(err));
	});

	return;
};

exports.getCreditCard = function(req, res) {
	var id = req.params.id;
	console.log('Function-credit_cardApi-getCreditCard  --_id:' + id);


	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check principal is customer or administrator
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='customer' || role=='admin') {
			// Check principal is owner or administrator
			CustomerService.checkOwnerOrAdmin(cookie, jwtKey, id, function (response) {
				if (response) {
					// Get credit card
					CreditCard.findById(id, function(err, creditCard) {
						if(err){
							res.status(500).json({success: false, message: err.errors});
						}
						else{
							res.status(200).json(creditCard);
						}
					});
				} else {
					res.status(401).json({success: false, message: 'Doesnt have permission'});
				}
			});
		} else {
			res.status(401).json({success: false, message: 'Doesnt have permission'});
		}
	});
};

exports.updateCreditCard = function (credit_card_id, credit_card, callback) {

	// Update credit card
	CreditCard.findByIdAndUpdate(credit_card_id, { $set: {
		holderName: credit_card.holderName,
		number: credit_card.number,
		expirationMonth: credit_card.expirationMonth,
		expirationYear: credit_card.expirationYear,
		cvcCode: credit_card.cvcCode
	}}, function (err, cc) {
		console.log(err);
		if(err){
			callback(db_utils.handleInsertErrors(err));
		} else {
			callback(db_utils.handleInsertErrors(null));
		}
	});

	return;
};
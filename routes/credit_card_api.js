var CreditCard = require('../models/credit_card'),
	db_utils = require('./db_utils');

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

	CreditCard.findById(id, function(err, creditCard) {
		if(err){
			res.status(500).json({success: false, message: err});
		}
		else{
			res.status(200).json(creditCard);
		}
	});
}

exports.updateCreditCard = function (credit_card_id, credit_card, callback) {
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
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
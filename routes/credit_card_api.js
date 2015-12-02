var db_utils = require('./db_utils');


//Syncronous
exports.newCredit_card = function (credit_card, callback) {
	console.log('Function-credit_card_api-newCustomer');

	credit_card.save(function (err) {
		callback(db_utils.handleInsertErrors(err));

		return;
	});

};
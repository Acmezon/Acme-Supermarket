var request = require('request');

exports.storePurchaseInRecommendation = function(customer, product) {
	request.post(
		{
			url:'http://localhost:3030/api/storePurchase', 
			form: {
					customer: customer,
					product : product
				}
		}, function (err,httpResponse,body){
			if(err) {
				return false;
			}

			if(httpResponse.statusCode == 500) {
				console.log("Is 500");
				return false;
			}

			if(httpResponse.statusCode == 200) {
				return true;
			}
		}
	);
}
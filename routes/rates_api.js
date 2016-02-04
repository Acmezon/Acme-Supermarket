var db_utils = require('./db_utils');
var Rate = require('../models/rate');

// Devuelve la valoracion media del producto con id
exports.getAverageRatingByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/getAverageRatingByProductId/'+_code)

	Rate.find({product_id: _code},function (err,rates){
		if(err > 0){
			console.log('---ERROR finding Rates with  product_id: '+_code+' message: '+ err);
			res.status(500).json({success: false, message: err});
		}else{
			//console.log(rates);
			var total = 0;
			for(var i = 0; i < rates.length; i++) {
			    total += rates[i].value;
			}
			var rating = total / rates.length;
			res.status(200).json(rating);
		}
	});
}
var db_utils = require('./db_utils');
var Reputation = require('../models/reputation');
var multer  = require('multer');
var fs = require('fs');

//Devuelve la reputacion media para un supplier
exports.getAverageReputationBySupplierId = function (req, res) {
	var _code = req.params.id;
	console.log('GET /api/averageReputationBySupplierId/'+_code)

	Reputation.find({supplier_id: _code},function(err,reputations){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors.length > 0){
			console.log('---ERROR finding Reputation with  supplier_id: '+_code+' message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			var total = 0;
			for(var i = 0; i < reputations.length; i++) {
			    total += reputations[i].value;
			}
			var reputation = total / reputations.length;
			res.status(200).json(reputation);
		}
	});
};
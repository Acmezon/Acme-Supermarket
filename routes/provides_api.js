var db_utils = require('./db_utils');
var Provide = require('../models/provide');
var multer  = require('multer');
var fs = require('fs');

// Devuelve una lista de Provides que tienen un producto con id
exports.getProvidesByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/getProvidesByProductId/'+_code)

	Provide.find({product_id: _code},function(err,provides){
		//TODO: Comprobar errores correctamente
		var errors= [];//db_utils.handleErrors(err);
		if(errors.length > 0){
			console.log('---ERROR finding Provides with  product_id: '+_code+' message: '+errors);
			res.status(500).json({success: false, message: errors});
		}else{
			//console.log(provides);
			res.status(200).json(provides);
		}
	});
}
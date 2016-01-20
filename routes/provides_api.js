var db_utils = require('./db_utils'),
	Provide = require('../models/provide'),
	ActorService = require('./services/service_actors');

// Devuelve una lista de Provides que tienen un producto con id
exports.getProvidesByProductId = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/providesByProductId/'+_code)

	Provide.find({product_id: _code},function(err,provides){
		if(err){
			console.log('---ERROR finding Provides with  product_id: '+_code+' message: '+err);
			res.status(500).json({success: false, message: err});
		}else{
			//console.log(provides);
			res.status(200).json(provides);
		}
	});
};

// 
exports.getProvide = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/provide/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			Provide.findById( _code,function(err,provide){
				if(err){
					console.log('---ERROR finding Provide: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(provide);
					res.status(200).json(provide);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesn't have permission"});
		}
	});
};
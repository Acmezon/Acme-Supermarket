var Admin = require('../models/admin'),
	db_utils = require('./db_utils'),
	ActorService = require('./services/service_actors.js');

// Devuelve si el usuario es un administrador
exports.isAdmin = function(req, res) {
	var _id = req.params.id;
	console.log('Function-adminsApi-isAdmin -- _id:'+_id);

	// Check actor is same as principal
	ActorService.checkPrincipal(req.cookies.session, req.app.get('superSecret'), function (isPrincipal) {
		if (isPrincipal) {
			// Check is admin
			Admin.findById(_id, function(err,user){
				if(err){
					res.status(500).json({success: false, message: err});
				}
				else{
					if (user._type == 'Admin') {
						res.status(200).json(true);
					} else {
						res.status(200).json(false);
					}			
				}
			});
		} else {
			res.status(401).json({message : 'Doesnt have permissions'});
		}
	});
};

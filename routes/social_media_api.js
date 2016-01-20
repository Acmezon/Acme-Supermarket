var SocialMediaService = require('./services/service_social_media');

//Inicia el servicio de escucha en twitter
exports.launchTwitterScrapper = function(req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if(role == "admin") {
			var launched = SocialMediaService.runProcess();

			if(launched) {
				res.sendStatus(200);
			} else {
				res.sendStatus(503);
			}
		} else {
			res.sendStatus(403);
		}
	});
}

//Para el servicio de escucha en twitter
exports.stopTwitterScrapper = function(req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if(role == "admin") {
			var stopped = SocialMediaService.stopProcess();

			if(stopped) {
				res.sendStatus(200);
			} else {
				res.sendStatus(503);
			}
		} else {
			res.sendStatus(403);
		}
	});
}

//Comprueba si el servicio de escucha en twitter está iniciado
exports.isTwitterScrapperRunning = function(req, res) {
	var jwtKey = req.app.get('superSecret');
	var cookie = req.cookies.session;
	// Check is admin
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if(role == "admin") {
			var isRunning = SocialMediaService.isProcessAlive();

			res.status(200).json({running : isRunning});
		} else {
			res.sendStatus(403);
		}
	});
}
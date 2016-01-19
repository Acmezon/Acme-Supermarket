var SocialMediaService = require('services/social_media_service');

exports.launchTwitterScrapper = function(req, res) {
	var launched = SocialMediaService.runProcess();

	if(launched) {
		res.sendStatus(200);
	} else {
		res.sendStatus(503);
	}
}

exports.stopTwitterScrapper = function(req, res) {
	var stopped = SocialMediaService.stopProcess();

	if(stopped) {
		res.sendStatus(200);
	} else {
		res.sendStatus(503);
	}
}

exports.isTwitterScrapperRunning = function(req, res) {
	var isRunning = SocialMediaService.isProcessAlive();

	res.status(200).json({running : isRunning});
}
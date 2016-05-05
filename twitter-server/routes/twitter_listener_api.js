var TwitterService = require('./services/service_twitter_listener');

exports.start_twitter_listener = function(req, res) {
	var launched = TwitterService.start_twitter_listener();

	if(launched) {
		res.sendStatus(200);
	} else {
		res.sendStatus(503);
	}
}

exports.stop_twitter_listener = function(req, res) {
	var stopped = TwitterService.stop_twitter_listener();

	if(stopped) {
		res.sendStatus(200);
	} else {
		res.sendStatus(503);
	}
}

exports.is_listener_alive = function(req, res) {
	var isRunning = TwitterService.is_listener_alive();

	res.status(200).json({running : isRunning});
}
var schedule = require('node-schedule'),
	sync = require('synchronize')
	SentimentService = require('./services/service_sentiment');

exports.scheduleSentimentAnalysis = function() {
	//Every hour
	var autoPurchase = schedule.scheduleJob('0 * * * *', function(){
		SentimentService.runSentimentAnalysis(function (err, data){
			if(err) {
				console.log('Error executing sentiment analysis. Error %s', err);
			}
			console.log("Finished");
		});
	});

	console.log("Sentiment analysis successfuly scheduled")
}